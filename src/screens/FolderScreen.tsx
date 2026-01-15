// Folder Screen - Clean & Sleek Design
import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Folder, Link } from '../utils/storage';
import { verifyPassword } from '../utils/encryption';
import LinkCard from '../components/LinkCard';
import AddEditModal from '../components/AddEditModal';
import PasswordModal from '../components/PasswordModal';
import ActionModal from '../components/ActionModal';
import ConfirmModal from '../components/ConfirmModal';

interface FolderScreenProps {
    route: {
        params: {
            folder: Folder;
        };
    };
    navigation: any;
}

const FolderScreen: React.FC<FolderScreenProps> = ({ route, navigation }) => {
    const { folder } = route.params;
    const {
        loading,
        refreshData,
        getLinksByFolder,
        addLink,
        updateLink,
        deleteLink,
        isItemUnlocked,
        unlockItem,
    } = useApp();

    const [showAddModal, setShowAddModal] = useState(false);
    const [editLink, setEditLink] = useState<Link | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pendingLink, setPendingLink] = useState<Link | null>(null);
    const [passwordError, setPasswordError] = useState('');

    // Action modal state
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionLink, setActionLink] = useState<Link | null>(null);

    // Delete confirmation modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const folderLinks = getLinksByFolder(folder.id);

    useFocusEffect(
        useCallback(() => {
            refreshData();
        }, []),
    );

    const handleLinkPress = (link: Link) => {
        if (link.isPrivate && !isItemUnlocked(link.id)) {
            setPendingLink(link);
            setShowPasswordModal(true);
        }
    };

    const handlePasswordSubmit = (password: string) => {
        if (pendingLink && pendingLink.passwordHash) {
            if (verifyPassword(password, pendingLink.passwordHash)) {
                unlockItem(pendingLink.id);
                setShowPasswordModal(false);
                setPasswordError('');
                setPendingLink(null);
            } else {
                setPasswordError('Incorrect password');
            }
        }
    };

    const handleLongPress = (link: Link) => {
        setActionLink(link);
        setShowActionModal(true);
    };

    const handleEdit = () => {
        if (actionLink) {
            setEditLink(actionLink);
            setShowAddModal(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if (actionLink) {
            await deleteLink(actionLink.id);
            setActionLink(null);
        }
    };

    const handleSave = async (item: Link) => {
        try {
            if (editLink) {
                await updateLink(item);
            } else {
                await addLink(item);
            }
            setEditLink(null);
        } catch (error) {
            console.error('Error saving link:', error);
        }
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Icon name="link-variant" size={32} color={colors.textMuted} />
            </View>
            <Text style={styles.emptyTitle}>No links yet</Text>
            <Text style={styles.emptySubtitle}>
                Tap + to add your first link
            </Text>
        </View>
    );

    const folderColor = folder.color || colors.primary;

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Clean Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}>
                    <Icon name="arrow-left" size={22} color={colors.text} />
                </TouchableOpacity>

                <View style={styles.headerContent}>
                    <View style={[styles.folderIcon, { backgroundColor: folderColor + '18' }]}>
                        <Icon
                            name={folder.icon || 'folder'}
                            size={20}
                            color={folderColor}
                        />
                    </View>
                    <View style={styles.headerText}>
                        <Text style={styles.folderName} numberOfLines={1}>
                            {folder.name}
                        </Text>
                        <Text style={styles.linkCount}>
                            {folderLinks.length} {folderLinks.length === 1 ? 'link' : 'links'}
                        </Text>
                    </View>
                </View>

                {folder.isPrivate && (
                    <View style={styles.privateBadge}>
                        <Icon name="lock-outline" size={14} color={colors.locked} />
                    </View>
                )}
            </View>

            {/* Links Grid */}
            <FlatList
                data={folderLinks}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <LinkCard
                        link={item}
                        isUnlocked={isItemUnlocked(item.id)}
                        onPress={() => handleLinkPress(item)}
                        onLongPress={() => handleLongPress(item)}
                    />
                )}
                numColumns={2}
                contentContainerStyle={styles.gridContent}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={!loading ? renderEmpty : null}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refreshData}
                        tintColor={colors.primary}
                        colors={[colors.primary]}
                    />
                }
                showsVerticalScrollIndicator={false}
            />

            {/* Sleek FAB */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => {
                    setEditLink(null);
                    setShowAddModal(true);
                }}
                activeOpacity={0.9}>
                <Icon name="plus" size={26} color="#fff" />
            </TouchableOpacity>

            {/* Add/Edit Modal */}
            <AddEditModal
                visible={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditLink(null);
                }}
                onSave={item => handleSave(item as Link)}
                onUpdateLink={updateLink}
                type="link"
                editItem={editLink}
                folderId={folder.id}
            />

            {/* Password Modal */}
            <PasswordModal
                visible={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                    setPendingLink(null);
                    setPasswordError('');
                }}
                onSubmit={handlePasswordSubmit}
                mode="enter"
                error={passwordError}
            />

            {/* Action Modal (Edit/Delete options) */}
            <ActionModal
                visible={showActionModal}
                onClose={() => setShowActionModal(false)}
                title={actionLink?.title || ''}
                subtitle="Link"
                options={[
                    {
                        icon: 'pencil-outline',
                        label: 'Edit',
                        onPress: handleEdit,
                    },
                    {
                        icon: 'delete-outline',
                        label: 'Delete',
                        onPress: () => setShowDeleteModal(true),
                        danger: true,
                    },
                ]}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                visible={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                title="Delete Link?"
                message="This link will be permanently deleted. This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                danger
                icon="delete-alert-outline"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingTop: (StatusBar.currentHeight || 44) + spacing.sm,
        paddingBottom: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    folderIcon: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerText: {
        marginLeft: spacing.sm,
        flex: 1,
    },
    folderName: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    linkCount: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 1,
    },
    privateBadge: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.full,
        backgroundColor: colors.locked + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gridContent: {
        padding: spacing.sm,
        paddingBottom: 100,
    },
    row: {
        justifyContent: 'flex-start',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.xxl * 2,
        paddingHorizontal: spacing.xl,
    },
    emptyIconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    emptyTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
    },
});

export default FolderScreen;
