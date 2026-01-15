// Folder Card Component - Clean & Sleek Design
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { Folder } from '../utils/storage';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - spacing.md * 3) / 2;

interface FolderCardProps {
    folder: Folder;
    linkCount: number;
    isUnlocked: boolean;
    onPress: () => void;
    onLongPress: () => void;
}

const FolderCard: React.FC<FolderCardProps> = ({
    folder,
    linkCount,
    isUnlocked,
    onPress,
    onLongPress,
}) => {
    const folderColor = folder.color || colors.primary;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
            onLongPress={onLongPress}
            activeOpacity={0.8}>
            {/* Content */}
            <View style={styles.content}>
                {/* Header with icon and lock */}
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: folderColor + '18' }]}>
                        <Icon name={folder.icon || 'folder'} size={24} color={folderColor} />
                    </View>
                    {folder.isPrivate && (
                        <View style={styles.lockBadge}>
                            <Icon
                                name={isUnlocked ? 'lock-open-variant-outline' : 'lock-outline'}
                                size={14}
                                color={isUnlocked ? colors.success : colors.locked}
                            />
                        </View>
                    )}
                </View>

                {/* Info */}
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>
                        {folder.name}
                    </Text>
                    <Text style={styles.count}>
                        {linkCount} {linkCount === 1 ? 'link' : 'links'}
                    </Text>
                </View>
            </View>

            {/* Subtle color indicator */}
            <View style={[styles.colorIndicator, { backgroundColor: folderColor }]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_SIZE,
        height: CARD_SIZE * 0.7,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        margin: spacing.sm / 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    content: {
        flex: 1,
        padding: spacing.md,
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    lockBadge: {
        width: 28,
        height: 28,
        borderRadius: borderRadius.full,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        marginTop: 'auto',
    },
    name: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
        marginBottom: 2,
    },
    count: {
        fontSize: 12,
        color: colors.textMuted,
    },
    colorIndicator: {
        height: 3,
        width: '100%',
    },
});

export default FolderCard;
