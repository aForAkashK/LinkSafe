// Link Card Component - Clean & Sleek Design
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Image,
    ToastAndroid,
    Platform,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { Link } from '../utils/storage';

const { width } = Dimensions.get('window');
const CARD_SIZE = (width - spacing.md * 3) / 2;
const CARD_HEIGHT = CARD_SIZE * 0.7; // Match FolderCard height
const IMAGE_HEIGHT = CARD_HEIGHT * 0.55;

interface LinkCardProps {
    link: Link;
    isUnlocked: boolean;
    onPress: () => void;
    onLongPress: () => void;
}

const getDomainFromUrl = (url: string): string => {
    try {
        const match = url.match(/^(?:https?:\/\/)?(?:www\.)?([^\/\?#]+)/i);
        return match ? match[1] : url;
    } catch {
        return url;
    }
};

const getFaviconUrl = (url: string): string => {
    try {
        const domain = getDomainFromUrl(url);
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    } catch {
        return '';
    }
};

const getDomainColor = (url: string): string => {
    const domain = getDomainFromUrl(url).toLowerCase();

    if (domain.includes('flipkart')) return '#F8CF46';
    if (domain.includes('amazon')) return '#FF9900';
    if (domain.includes('github')) return '#6E7681';
    if (domain.includes('youtube')) return '#FF0000';
    if (domain.includes('twitter') || domain.includes('x.com')) return '#1DA1F2';
    if (domain.includes('linkedin')) return '#0077B5';
    if (domain.includes('facebook')) return '#1877F2';
    if (domain.includes('instagram')) return '#E4405F';
    if (domain.includes('reddit')) return '#FF4500';
    if (domain.includes('google')) return '#4285F4';
    if (domain.includes('netflix')) return '#E50914';
    if (domain.includes('spotify')) return '#1DB954';

    let hash = 0;
    for (let i = 0; i < domain.length; i++) {
        hash = domain.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 45%, 45%)`;
};

const LinkCard: React.FC<LinkCardProps> = ({
    link,
    isUnlocked,
    onPress,
    onLongPress,
}) => {
    const [imageError, setImageError] = useState(false);

    const domain = getDomainFromUrl(link.url);
    const bgColor = getDomainColor(link.url);
    const faviconUrl = getFaviconUrl(link.url);
    const hasPreviewImage = link.previewImage && !imageError;

    const handleCopyLink = () => {
        if (link.isPrivate && !isUnlocked) {
            onPress();
            return;
        }

        Clipboard.setString(link.url);

        if (Platform.OS === 'android') {
            ToastAndroid.show('Link copied to clipboard', ToastAndroid.SHORT);
        }
    };

    const showLocked = link.isPrivate && !isUnlocked;

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={showLocked ? onPress : handleCopyLink}
            onLongPress={onLongPress}
            activeOpacity={0.8}>
            {/* Image Area */}
            <View style={[styles.imageContainer, !hasPreviewImage && { backgroundColor: bgColor }]}>
                {showLocked ? (
                    <View style={styles.lockedContent}>
                        <View style={styles.lockedIcon}>
                            <Icon name="eye-off-outline" size={24} color={colors.textMuted} />
                        </View>
                    </View>
                ) : hasPreviewImage ? (
                    <Image
                        source={{ uri: link.previewImage! }}
                        style={styles.previewImage}
                        onError={() => setImageError(true)}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={styles.fallbackContainer}>
                        <Image
                            source={{ uri: faviconUrl }}
                            style={styles.favicon}
                            resizeMode="contain"
                        />
                    </View>
                )}

                {/* Lock Badge */}
                {link.isPrivate && (
                    <View style={styles.lockBadge}>
                        <Icon
                            name={isUnlocked ? 'lock-open-variant-outline' : 'lock-outline'}
                            size={12}
                            color="#fff"
                        />
                    </View>
                )}
            </View>

            {/* Content Area */}
            <View style={styles.content}>
                <Text style={styles.title} numberOfLines={1}>
                    {showLocked ? '••••••••' : link.title}
                </Text>
                <View style={styles.domainRow}>
                    <View style={[styles.domainDot, { backgroundColor: bgColor }]} />
                    <Text style={styles.domain} numberOfLines={1}>
                        {showLocked ? '••••••' : domain}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: CARD_SIZE,
        height: CARD_HEIGHT,
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        margin: spacing.sm / 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        ...shadows.sm,
    },
    imageContainer: {
        width: '100%',
        height: IMAGE_HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    lockedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.cardHover,
        width: '100%',
    },
    lockedIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: colors.card,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewImage: {
        width: '100%',
        height: '100%',
    },
    fallbackContainer: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    favicon: {
        width: 40,
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderRadius: borderRadius.sm,
    },
    lockBadge: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.locked,
        borderRadius: borderRadius.full,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: spacing.sm,
        paddingHorizontal: spacing.md,
        justifyContent: 'center',
    },
    title: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.text,
        lineHeight: 16,
        marginBottom: 2,
    },
    domainRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    domainDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    domain: {
        fontSize: 12,
        color: colors.textMuted,
        flex: 1,
    },
});

export default LinkCard;
