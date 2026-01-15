// Privacy Policy Screen - Clean & Sleek Design
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius } from '../theme/colors';

interface PrivacyPolicyScreenProps {
    navigation: any;
}

const PrivacyPolicyScreen: React.FC<PrivacyPolicyScreenProps> = ({ navigation }) => {
    const sections = [
        {
            title: 'Data Collection',
            icon: 'database-outline',
            content: 'LinkSafe does not collect any personal data. All your links, folders, and preferences are stored exclusively on your device. We have no servers that receive or store your information.',
        },
        {
            title: 'Data Storage',
            icon: 'cellphone-lock',
            content: 'Your data is stored locally on your device using secure storage mechanisms. Private links and folders are protected with password-based encryption, ensuring only you can access them.',
        },
        {
            title: 'No Internet Required',
            icon: 'wifi-off',
            content: 'LinkSafe works completely offline. The app does not require an internet connection to function, and no data is transmitted over the network.',
        },
        {
            title: 'Third-Party Services',
            icon: 'share-variant-outline',
            content: 'When you open a link, it is handled by your device\'s default browser or app. We do not track which links you open or share this information with any third parties.',
        },
        {
            title: 'Link Previews',
            icon: 'image-outline',
            content: 'When adding links, the app may fetch preview images and titles from the web. This is done directly from your device and no information is stored on external servers.',
        },
        {
            title: 'Data Deletion',
            icon: 'delete-outline',
            content: 'You have complete control over your data. You can delete individual links, folders, or clear all data from the Settings screen at any time. Deleted data cannot be recovered.',
        },
        {
            title: 'Updates to Policy',
            icon: 'update',
            content: 'We may update this privacy policy from time to time. Any changes will be reflected in the app. Continued use of the app after changes constitutes acceptance of the updated policy.',
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}>
                    <Icon name="arrow-left" size={22} color={colors.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Privacy Policy</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Introduction */}
                <View style={styles.introCard}>
                    <View style={styles.introIconBg}>
                        <Icon name="shield-check-outline" size={28} color={colors.primary} />
                    </View>
                    <Text style={styles.introTitle}>Your Privacy Matters</Text>
                    <Text style={styles.introText}>
                        LinkSafe is designed with privacy as a core principle. We believe your data belongs to you and should stay on your device.
                    </Text>
                </View>

                {/* Policy Sections */}
                <View style={styles.sectionsContainer}>
                    {sections.map((section, index) => (
                        <View key={index} style={styles.policySection}>
                            <View style={styles.sectionHeader}>
                                <View style={styles.sectionIconBg}>
                                    <Icon name={section.icon} size={18} color={colors.primary} />
                                </View>
                                <Text style={styles.sectionTitle}>{section.title}</Text>
                            </View>
                            <Text style={styles.sectionContent}>{section.content}</Text>
                        </View>
                    ))}
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Last updated: January 2024</Text>
                    <Text style={styles.footerSubtext}>
                        If you have any questions about this privacy policy, please contact us.
                    </Text>
                </View>
            </ScrollView>
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
    introCard: {
        backgroundColor: colors.primary + '08',
        marginHorizontal: spacing.md,
        marginTop: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary + '20',
    },
    introIconBg: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    introTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        marginBottom: spacing.sm,
    },
    introText: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
    },
    sectionsContainer: {
        marginTop: spacing.lg,
        paddingHorizontal: spacing.md,
    },
    policySection: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sectionIconBg: {
        width: 32,
        height: 32,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    sectionTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    sectionContent: {
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 21,
    },
    footer: {
        alignItems: 'center',
        padding: spacing.xl,
        marginBottom: spacing.xxl,
    },
    footerText: {
        fontSize: 13,
        fontWeight: '500',
        color: colors.textMuted,
    },
    footerSubtext: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.sm,
        maxWidth: 280,
    },
});

export default PrivacyPolicyScreen;
