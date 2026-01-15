// Settings Screen - Clean & Sleek Design
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';
import { clearAllData } from '../utils/storage';
import { useApp } from '../context/AppContext';
import ConfirmModal from '../components/ConfirmModal';
import FeedbackModal from '../components/FeedbackModal';

interface SettingsScreenProps {
    navigation: any;
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
    const { folders, links, refreshData } = useApp();
    const [showClearModal, setShowClearModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);

    const handleClearData = async () => {
        try {
            await clearAllData();
            await refreshData();
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Error clearing data:', error);
        }
    };

    const SettingItem = ({
        icon,
        title,
        subtitle,
        onPress,
        showArrow = true,
        danger = false,
    }: {
        icon: string;
        title: string;
        subtitle?: string;
        onPress: () => void;
        showArrow?: boolean;
        danger?: boolean;
    }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
            <View
                style={[
                    styles.iconContainer,
                    { backgroundColor: danger ? colors.error + '15' : colors.backgroundLight },
                ]}>
                <Icon
                    name={icon}
                    size={20}
                    color={danger ? colors.error : colors.textSecondary}
                />
            </View>
            <View style={styles.settingContent}>
                <Text style={[styles.settingTitle, danger && { color: colors.error }]}>
                    {title}
                </Text>
                {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
            </View>
            {showArrow && (
                <Icon name="chevron-right" size={20} color={colors.textMuted} />
            )}
        </TouchableOpacity>
    );

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
                <Text style={styles.title}>Settings</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Overview</Text>
                    <View style={styles.statsCard}>
                        <View style={styles.statItem}>
                            <View style={[styles.statIconBg, { backgroundColor: colors.primary + '15' }]}>
                                <Icon name="folder-outline" size={20} color={colors.primary} />
                            </View>
                            <Text style={styles.statValue}>{folders.length}</Text>
                            <Text style={styles.statLabel}>Folders</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIconBg, { backgroundColor: colors.secondary + '15' }]}>
                                <Icon name="link-variant" size={20} color={colors.secondary} />
                            </View>
                            <Text style={styles.statValue}>{links.length}</Text>
                            <Text style={styles.statLabel}>Links</Text>
                        </View>
                        <View style={styles.statItem}>
                            <View style={[styles.statIconBg, { backgroundColor: colors.locked + '15' }]}>
                                <Icon name="lock-outline" size={20} color={colors.locked} />
                            </View>
                            <Text style={styles.statValue}>
                                {folders.filter(f => f.isPrivate).length +
                                    links.filter(l => l.isPrivate).length}
                            </Text>
                            <Text style={styles.statLabel}>Private</Text>
                        </View>
                    </View>
                </View>

                {/* App Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>About</Text>
                    <View style={styles.settingsGroup}>
                        <SettingItem
                            icon="information-outline"
                            title="About LinkSafe"
                            subtitle="Version, features & more"
                            onPress={() => navigation.navigate('About')}
                        />
                        <View style={styles.separator} />
                        <SettingItem
                            icon="shield-check-outline"
                            title="Privacy Policy"
                            subtitle="How your data is protected"
                            onPress={() => navigation.navigate('PrivacyPolicy')}
                        />
                    </View>
                </View>

                {/* Feedback Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Feedback</Text>
                    <View style={styles.settingsGroup}>
                        <SettingItem
                            icon="message-text-outline"
                            title="Send Feedback"
                            subtitle="Help us improve LinkSafe"
                            onPress={() => setShowFeedbackModal(true)}
                        />
                    </View>
                </View>

                {/* Data Section */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Data</Text>
                    <View style={styles.settingsGroup}>
                        <SettingItem
                            icon="delete-outline"
                            title="Clear All Data"
                            subtitle="Delete all folders and links"
                            onPress={() => setShowClearModal(true)}
                            showArrow={false}
                            danger
                        />
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Icon name="shield-lock-outline" size={32} color={colors.textMuted} />
                    <Text style={styles.footerText}>
                        Your data is encrypted and stored locally on your device
                    </Text>
                    <Text style={styles.madeWithLove}>
                        Made with ❤️ for link lovers
                    </Text>
                </View>
            </ScrollView>

            {/* Clear Data Confirmation Modal */}
            <ConfirmModal
                visible={showClearModal}
                onClose={() => setShowClearModal(false)}
                onConfirm={handleClearData}
                title="Clear All Data?"
                message="This will permanently delete all your folders and links. This action cannot be undone."
                confirmText="Clear All"
                cancelText="Cancel"
                danger
                icon="delete-alert-outline"
            />

            {/* Success Modal */}
            <ConfirmModal
                visible={showSuccessModal}
                onClose={() => setShowSuccessModal(false)}
                onConfirm={() => setShowSuccessModal(false)}
                title="Data Cleared"
                message="All your data has been successfully deleted."
                confirmText="OK"
                cancelText=""
                icon="check-circle-outline"
            />

            {/* Feedback Modal */}
            <FeedbackModal
                visible={showFeedbackModal}
                onClose={() => setShowFeedbackModal(false)}
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
        justifyContent: 'space-between',
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
        borderWidth: 1,
        borderColor: colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    placeholder: {
        width: 40,
    },
    content: {
        flex: 1,
    },
    section: {
        marginTop: spacing.lg,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textMuted,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        marginLeft: spacing.lg,
        marginBottom: spacing.sm,
    },
    statsCard: {
        flexDirection: 'row',
        backgroundColor: colors.backgroundLight,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statIconBg: {
        width: 44,
        height: 44,
        borderRadius: borderRadius.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    statValue: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.text,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: colors.textMuted,
        marginTop: 2,
    },
    settingsGroup: {
        backgroundColor: colors.backgroundLight,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    settingContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    settingTitle: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
    },
    settingSubtitle: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 2,
    },
    separator: {
        height: 1,
        backgroundColor: colors.border,
        marginLeft: spacing.md + 36 + spacing.md,
    },
    footer: {
        alignItems: 'center',
        padding: spacing.xl,
        marginTop: spacing.lg,
        marginBottom: spacing.xxl,
    },
    footerText: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.md,
        maxWidth: 240,
        lineHeight: 18,
    },
    madeWithLove: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginTop: spacing.lg,
        fontWeight: '500',
    },
});

export default SettingsScreen;
