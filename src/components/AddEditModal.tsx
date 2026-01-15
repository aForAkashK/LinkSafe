// Add/Edit Modal Component - For adding/editing folders and links
import React, { useState, useEffect } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Switch,
    ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';
import { Folder, Link } from '../utils/storage';
import { hashPassword } from '../utils/encryption';
import { fetchLinkPreviewCombined } from '../utils/linkPreview';
import { v4 as uuidv4 } from 'uuid';

type ItemType = 'folder' | 'link';

interface AddEditModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (item: Folder | Link) => void;
    onUpdateLink?: (link: Link) => void; // Callback to update link with preview
    type: ItemType;
    editItem?: Folder | Link | null;
    folderId?: string | null;
    prefilledUrl?: string | null; // Pre-fill URL when shared from another app
}

const FOLDER_COLORS = [
    '#6C5CE7',
    '#00CEC9',
    '#E17055',
    '#FDCB6E',
    '#74B9FF',
    '#A29BFE',
    '#FF7675',
    '#55EFC4',
];

const FOLDER_ICONS = [
    'folder',
    'folder-heart',
    'folder-star',
    'folder-key',
    'folder-cog',
    'folder-home',
    'folder-account',
    'folder-network',
];

const AddEditModal: React.FC<AddEditModalProps> = ({
    visible,
    onClose,
    onSave,
    onUpdateLink,
    type,
    editItem,
    folderId,
    prefilledUrl,
}) => {
    const [name, setName] = useState('');
    const [url, setUrl] = useState('');
    const [description, setDescription] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [selectedColor, setSelectedColor] = useState(FOLDER_COLORS[0]);
    const [selectedIcon, setSelectedIcon] = useState(FOLDER_ICONS[0]);
    const [error, setError] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (editItem) {
            if (type === 'folder') {
                const folder = editItem as Folder;
                setName(folder.name);
                setIsPrivate(folder.isPrivate);
                setSelectedColor(folder.color || FOLDER_COLORS[0]);
                setSelectedIcon(folder.icon || FOLDER_ICONS[0]);
            } else {
                const link = editItem as Link;
                setName(link.title);
                setUrl(link.url);
                setDescription(link.description || '');
                setIsPrivate(link.isPrivate);
            }
        } else {
            resetForm();
            // Pre-fill URL if shared from another app
            if (prefilledUrl && type === 'link') {
                setUrl(prefilledUrl);
            }
        }
    }, [editItem, visible, type, prefilledUrl]);

    const resetForm = () => {
        setName('');
        setUrl('');
        setDescription('');
        setIsPrivate(false);
        setPassword('');
        setConfirmPassword('');
        setSelectedColor(FOLDER_COLORS[0]);
        setSelectedIcon(FOLDER_ICONS[0]);
        setError('');
        setIsSaving(false);
    };

    const handleSave = async () => {
        // Validation
        if (type === 'folder' && !name.trim()) {
            setError('Folder name is required');
            return;
        }

        if (type === 'link' && !url.trim()) {
            setError('URL is required');
            return;
        }

        let finalUrl = url.trim();
        if (type === 'link') {
            if (!finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
                finalUrl = 'https://' + finalUrl;
            }
            try {
                new URL(finalUrl);
            } catch {
                setError('Invalid URL format');
                return;
            }
        }

        // Password validation for new private items
        if (isPrivate && !editItem?.isPrivate) {
            if (!password.trim()) {
                setError('Password is required for private items');
                return;
            }
            if (password.length < 4) {
                setError('Password must be at least 4 characters');
                return;
            }
            if (password !== confirmPassword) {
                setError('Passwords do not match');
                return;
            }
        }

        setIsSaving(true);
        setError('');

        const now = new Date().toISOString();
        let passwordHash: string | null = null;

        if (isPrivate) {
            if (password.trim()) {
                passwordHash = hashPassword(password);
            } else if (editItem?.isPrivate && editItem.passwordHash) {
                passwordHash = editItem.passwordHash;
            }
        }

        if (type === 'folder') {
            const folder: Folder = {
                id: editItem?.id || uuidv4(),
                name: name.trim(),
                isPrivate,
                passwordHash,
                color: selectedColor,
                icon: selectedIcon,
                createdAt: editItem?.createdAt || now,
                updatedAt: now,
            };
            onSave(folder);
            resetForm();
            onClose();
        } else {
            // For links - save immediately without blocking on preview fetch
            const existingLink = editItem as Link | null;
            const linkId = editItem?.id || uuidv4();

            // Keep existing preview if URL hasn't changed
            let previewImage: string | null = existingLink?.previewImage || null;
            let favicon: string | null = existingLink?.favicon || null;

            // For new links without a title, use domain as placeholder
            const getDomainTitle = (u: string): string => {
                try {
                    const match = u.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\?#]+)/i);
                    return match ? match[1] : u;
                } catch { return u; }
            };

            const link: Link = {
                id: linkId,
                title: name.trim() || getDomainTitle(finalUrl),
                url: finalUrl,
                description: description.trim(),
                folderId: folderId || null,
                isPrivate,
                passwordHash,
                favicon,
                previewImage,
                createdAt: editItem?.createdAt || now,
                updatedAt: now,
            };

            // Save link immediately (don't wait for preview)
            onSave(link);
            resetForm();
            onClose();

            // Fetch preview in background for new/changed URLs
            if (!existingLink || existingLink.url !== finalUrl) {
                fetchLinkPreviewCombined(finalUrl)
                    .then(preview => {
                        if (onUpdateLink) {
                            console.log('[LinkPreview] Updating link with preview:', preview.image, preview.title);
                            // Update link with preview image and title
                            const updatedLink: Link = {
                                ...link,
                                title: preview.title || link.title,
                                previewImage: preview.image || link.previewImage,
                                favicon: preview.favicon || link.favicon,
                                updatedAt: new Date().toISOString(),
                            };
                            onUpdateLink(updatedLink);
                        }
                    })
                    .catch(err => {
                        console.log('[LinkPreview] Background fetch failed:', err);
                    });
            }
        }
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>
                            {editItem ? 'Edit' : 'Add'} {type === 'folder' ? 'Folder' : 'Link'}
                        </Text>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Icon name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Folder Name Field (Folder only) */}
                        {type === 'folder' && (
                            <>
                                <Text style={styles.label}>Folder Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="My Folder"
                                    placeholderTextColor={colors.textMuted}
                                    value={name}
                                    onChangeText={setName}
                                    autoFocus
                                />
                            </>
                        )}

                        {/* URL Field (Link only) */}
                        {type === 'link' && (
                            <>
                                <Text style={styles.label}>Paste Link URL</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="https://example.com"
                                    placeholderTextColor={colors.textMuted}
                                    value={url}
                                    onChangeText={setUrl}
                                    autoCapitalize="none"
                                    keyboardType="url"
                                    autoFocus
                                />
                                <Text style={styles.hint}>
                                    Title and image will be fetched automatically
                                </Text>
                            </>
                        )}

                        {/* Color Selection (Folder only) */}
                        {type === 'folder' && (
                            <>
                                <Text style={styles.label}>Color</Text>
                                <View style={styles.colorRow}>
                                    {FOLDER_COLORS.map(color => (
                                        <TouchableOpacity
                                            key={color}
                                            style={[
                                                styles.colorOption,
                                                { backgroundColor: color },
                                                selectedColor === color && styles.colorSelected,
                                            ]}
                                            onPress={() => setSelectedColor(color)}>
                                            {selectedColor === color && (
                                                <Icon name="check" size={16} color="#fff" />
                                            )}
                                        </TouchableOpacity>
                                    ))}
                                </View>

                                <Text style={styles.label}>Icon</Text>
                                <View style={styles.iconRow}>
                                    {FOLDER_ICONS.map(icon => (
                                        <TouchableOpacity
                                            key={icon}
                                            style={[
                                                styles.iconOption,
                                                selectedIcon === icon && styles.iconSelected,
                                            ]}
                                            onPress={() => setSelectedIcon(icon)}>
                                            <Icon
                                                name={icon}
                                                size={24}
                                                color={
                                                    selectedIcon === icon
                                                        ? colors.primary
                                                        : colors.textSecondary
                                                }
                                            />
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </>
                        )}

                        {/* Private Toggle */}
                        <View style={styles.privateRow}>
                            <View style={styles.privateInfo}>
                                <Icon name="shield-lock" size={24} color={colors.primary} />
                                <View style={styles.privateText}>
                                    <Text style={styles.privateLabel}>Make Private</Text>
                                    <Text style={styles.privateHint}>
                                        Requires password to access
                                    </Text>
                                </View>
                            </View>
                            <Switch
                                value={isPrivate}
                                onValueChange={setIsPrivate}
                                trackColor={{ false: colors.border, true: colors.primary + '60' }}
                                thumbColor={isPrivate ? colors.primary : colors.textMuted}
                            />
                        </View>

                        {/* Password Fields */}
                        {isPrivate && (!editItem?.isPrivate || password.length > 0) && (
                            <>
                                <Text style={styles.label}>
                                    {editItem?.isPrivate ? 'New Password (leave empty to keep)' : 'Password'}
                                </Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter password"
                                    placeholderTextColor={colors.textMuted}
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />

                                {(!editItem?.isPrivate || password.length > 0) && (
                                    <>
                                        <Text style={styles.label}>Confirm Password</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Confirm password"
                                            placeholderTextColor={colors.textMuted}
                                            value={confirmPassword}
                                            onChangeText={setConfirmPassword}
                                            secureTextEntry
                                        />
                                    </>
                                )}
                            </>
                        )}

                        {error && <Text style={styles.errorText}>{error}</Text>}
                    </ScrollView>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}
                            disabled={isSaving}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.saveButton]}
                            onPress={handleSave}
                            disabled={isSaving}>
                            {isSaving ? (
                                <ActivityIndicator size="small" color={colors.text} />
                            ) : (
                                <Text style={styles.saveButtonText}>
                                    {editItem ? 'Save' : 'Add'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.card,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        ...typography.h2,
    },
    closeButton: {
        padding: spacing.sm,
    },
    content: {
        padding: spacing.lg,
    },
    label: {
        ...typography.caption,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    input: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...typography.body,
        borderWidth: 1,
        borderColor: colors.border,
    },
    multilineInput: {
        minHeight: 64,
        textAlignVertical: 'top',
    },
    hint: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.sm,
        fontStyle: 'italic',
    },
    colorRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    colorOption: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorSelected: {
        borderWidth: 3,
        borderColor: colors.text,
    },
    iconRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    iconOption: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    iconSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
    },
    privateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: spacing.lg,
        padding: spacing.md,
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    privateInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    privateText: {},
    privateLabel: {
        ...typography.body,
        fontWeight: '600',
    },
    privateHint: {
        ...typography.small,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        marginTop: spacing.md,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    button: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.backgroundLight,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    saveButtonText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
    },
});

export default AddEditModal;
