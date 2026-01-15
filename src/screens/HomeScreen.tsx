// Home Screen - Clean & Sleek Design
import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    RefreshControl,
    StatusBar,
    Dimensions,
    Image,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, typography, shadows } from '../theme/colors';
import { useApp } from '../context/AppContext';
import { Folder, Link } from '../utils/storage';
import { verifyPassword } from '../utils/encryption';
import FolderCard from '../components/FolderCard';
import LinkCard from '../components/LinkCard';
import AddEditModal from '../components/AddEditModal';
import PasswordModal from '../components/PasswordModal';
import ActionModal from '../components/ActionModal';
import ConfirmModal from '../components/ConfirmModal';

const { width } = Dimensions.get('window');

type AddType = 'folder' | 'link';
type GridItem = { type: 'folder'; data: Folder } | { type: 'link'; data: Link };

interface HomeScreenProps {
    navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
    const {
        folders,
        links,
        loading,
        refreshData,
        addFolder,
        updateFolder,
        deleteFolder,
        addLink,
        updateLink,
        deleteLink,
        getLinksByFolder,
        isItemUnlocked,
        unlockItem,
        sharedUrl,
        clearSharedUrl,
    } = useApp();

    const [showAddModal, setShowAddModal] = useState(false);
    const [addType, setAddType] = useState<AddType>('folder');
    const [editItem, setEditItem] = useState<Folder | Link | null>(null);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [pendingItem, setPendingItem] = useState<Folder | Link | null>(null);
    const [passwordError, setPasswordError] = useState('');
    const [showFab, setShowFab] = useState(false);

    // Action modal state
    const [showActionModal, setShowActionModal] = useState(false);
    const [actionItem, setActionItem] = useState<{ item: Folder | Link; type: 'folder' | 'link' } | null>(null);

    // Delete confirmation modal state
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // State for pre-filled shared URL
    const [prefilledUrl, setPrefilledUrl] = useState<string | null>(null);

    const rootLinks = getLinksByFolder(null);

    const gridItems: GridItem[] = [
        ...folders.map(f => ({ type: 'folder' as const, data: f })),
        ...rootLinks.map(l => ({ type: 'link' as const, data: l })),
    ];

    // Handle shared URL from other apps
    useEffect(() => {
        if (sharedUrl) {
            setPrefilledUrl(sharedUrl);
            setAddType('link');
            setEditItem(null);
            setShowAddModal(true);
            clearSharedUrl();
        }
    }, [sharedUrl]);

    useFocusEffect(
        useCallback(() => {
            refreshData();
        }, []),
    );

    const handleFolderPress = (folder: Folder) => {
        if (folder.isPrivate && !isItemUnlocked(folder.id)) {
            setPendingItem(folder);
            setShowPasswordModal(true);
        } else {
            navigation.navigate('Folder', { folder });
        }
    };

    const handleLinkPress = (link: Link) => {
        if (link.isPrivate && !isItemUnlocked(link.id)) {
            setPendingItem(link);
            setShowPasswordModal(true);
        }
    };

    const handlePasswordSubmit = (password: string) => {
        if (pendingItem && pendingItem.passwordHash) {
            if (verifyPassword(password, pendingItem.passwordHash)) {
                unlockItem(pendingItem.id);
                setShowPasswordModal(false);
                setPasswordError('');

                if ('color' in pendingItem) {
                    navigation.navigate('Folder', { folder: pendingItem });
                }
                setPendingItem(null);
            } else {
                setPasswordError('Incorrect password');
            }
        }
    };

    const handleLongPress = (item: Folder | Link, type: 'folder' | 'link') => {
        setActionItem({ item, type });
        setShowActionModal(true);
    };

    const handleEdit = () => {
        if (actionItem) {
            setAddType(actionItem.type);
            setEditItem(actionItem.item);
            setShowAddModal(true);
        }
    };

    const handleDeleteConfirm = async () => {
        if (actionItem) {
            if (actionItem.type === 'folder') {
                await deleteFolder(actionItem.item.id);
            } else {
                await deleteLink(actionItem.item.id);
            }
            setActionItem(null);
        }
    };

    const handleSave = async (item: Folder | Link) => {
        try {
            if (addType === 'folder') {
                if (editItem) {
                    await updateFolder(item as Folder);
                } else {
                    await addFolder(item as Folder);
                }
            } else {
                if (editItem) {
                    await updateLink(item as Link);
                } else {
                    await addLink(item as Link);
                }
            }
            setEditItem(null);
        } catch (error) {
            console.error('Error saving:', error);
        }
    };

    const getLinkCount = (folderId: string): number => {
        return links.filter(l => l.folderId === folderId).length;
    };

    const getActionItemName = () => {
        if (!actionItem) return '';
        return actionItem.type === 'folder'
            ? (actionItem.item as Folder).name
            : (actionItem.item as Link).title;
    };

    const renderEmpty = () => (
        <View style={styles.emptyContainer}>
            <View style={styles.emptyIconContainer}>
                <Icon name="link-variant" size={40} color={colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No links yet</Text>
            <Text style={styles.emptySubtitle}>
                Tap the + button to save your first link
            </Text>
        </View>
    );

    const renderGridItem = ({ item }: { item: GridItem }) => {
        if (item.type === 'folder') {
            return (
                <FolderCard
                    folder={item.data}
                    linkCount={getLinkCount(item.data.id)}
                    isUnlocked={isItemUnlocked(item.data.id)}
                    onPress={() => handleFolderPress(item.data)}
                    onLongPress={() => handleLongPress(item.data, 'folder')}
                />
            );
        } else {
            return (
                <LinkCard
                    link={item.data}
                    isUnlocked={isItemUnlocked(item.data.id)}
                    onPress={() => handleLinkPress(item.data)}
                    onLongPress={() => handleLongPress(item.data, 'link')}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} translucent />

            {/* Clean Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View style={styles.logoContainer}>
                        <View style={styles.logoIconWrapper}>
                            <Image
                                source={require('../assets/app_logo.png')}
                                style={styles.logoImage}
                                resizeMode="cover"
                            />
                        </View>
                        <Text style={styles.logoText}>LinkSafe</Text>
                    </View>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => navigation.navigate('Settings')}>
                        <Icon name="cog-outline" size={22} color={colors.textSecondary} />
                    </TouchableOpacity>
                </View>

                {/* Minimal Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{folders.length}</Text>
                        <Text style={styles.statLabel}>Folders</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{links.length}</Text>
                        <Text style={styles.statLabel}>Links</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>
                            {folders.filter(f => f.isPrivate).length + links.filter(l => l.isPrivate).length}
                        </Text>
                        <Text style={styles.statLabel}>Private</Text>
                    </View>
                </View>
            </View>

            {/* Section Title */}
            {gridItems.length > 0 && (
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Your Collection</Text>
                    <Text style={styles.sectionCount}>{gridItems.length} items</Text>
                </View>
            )}

            {/* Grid Content */}
            <FlatList
                data={gridItems}
                keyExtractor={item => item.data.id}
                renderItem={renderGridItem}
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
            <View style={styles.fabContainer}>
                {showFab && (
                    <View style={styles.fabOptions}>
                        <TouchableOpacity
                            style={styles.fabOption}
                            onPress={() => {
                                setAddType('folder');
                                setEditItem(null);
                                setShowAddModal(true);
                                setShowFab(false);
                            }}>
                            <Icon name="folder-plus-outline" size={20} color={colors.primary} />
                            <Text style={styles.fabOptionText}>Folder</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.fabOption}
                            onPress={() => {
                                setAddType('link');
                                setEditItem(null);
                                setShowAddModal(true);
                                setShowFab(false);
                            }}>
                            <Icon name="link-plus" size={20} color={colors.secondary} />
                            <Text style={styles.fabOptionText}>Link</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity
                    style={[styles.fab, showFab && styles.fabActive]}
                    onPress={() => setShowFab(!showFab)}
                    activeOpacity={0.9}>
                    <Icon
                        name={showFab ? 'close' : 'plus'}
                        size={26}
                        color="#fff"
                    />
                </TouchableOpacity>
            </View>

            {/* Add/Edit Modal */}
            <AddEditModal
                visible={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setEditItem(null);
                    setPrefilledUrl(null);
                }}
                onSave={handleSave}
                onUpdateLink={updateLink}
                type={addType}
                editItem={editItem}
                folderId={null}
                prefilledUrl={prefilledUrl}
            />

            {/* Password Modal */}
            <PasswordModal
                visible={showPasswordModal}
                onClose={() => {
                    setShowPasswordModal(false);
                    setPendingItem(null);
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
                title={getActionItemName()}
                subtitle={actionItem?.type === 'folder' ? 'Folder' : 'Link'}
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
                title={`Delete ${actionItem?.type === 'folder' ? 'Folder' : 'Link'}?`}
                message={
                    actionItem?.type === 'folder'
                        ? 'This will delete the folder and all links inside. This action cannot be undone.'
                        : 'This link will be permanently deleted. This action cannot be undone.'
                }
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
        paddingTop: (StatusBar.currentHeight || 44) + spacing.sm,
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        backgroundColor: colors.background,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.xl,
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    logoIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        // borderWidth: 1.5,
        // borderColor: colors.border,
        // overflow: 'hidden',
        // ...shadows.md,
    },
    logoImage: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
    },
    logoText: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: -0.5,
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.full,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.lg,
        paddingVertical: spacing.lg,
        paddingHorizontal: spacing.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 24,
        fontWeight: '700',
        color: colors.text,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statDivider: {
        width: 1,
        height: 32,
        backgroundColor: colors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.sm,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.text,
    },
    sectionCount: {
        fontSize: 13,
        color: colors.textMuted,
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
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: colors.backgroundLight,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.xs,
    },
    emptySubtitle: {
        fontSize: 14,
        color: colors.textMuted,
        textAlign: 'center',
    },
    fabContainer: {
        position: 'absolute',
        bottom: spacing.xl,
        right: spacing.lg,
        alignItems: 'flex-end',
    },
    fabOptions: {
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    fabOption: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        paddingVertical: spacing.sm + 2,
        paddingHorizontal: spacing.md,
        borderRadius: borderRadius.full,
        gap: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.md,
    },
    fabOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.text,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        ...shadows.lg,
    },
    fabActive: {
        backgroundColor: colors.textSecondary,
    },
});

export default HomeScreen;
