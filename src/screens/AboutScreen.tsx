// About Screen - Clean & Sleek Design
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    Linking,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

interface AboutScreenProps {
    navigation: any;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
    const appVersion = '1.0.0';

    const features = [
        { icon: 'shield-lock-outline', title: 'Secure Storage', description: 'All links are encrypted locally on your device' },
        { icon: 'folder-outline', title: 'Organized Folders', description: 'Keep your links organized in custom folders' },
        { icon: 'lock-outline', title: 'Private Links', description: 'Password protect sensitive links and folders' },
        { icon: 'cloud-off-outline', title: 'Offline First', description: 'Works completely offline, no internet required' },
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
                <Text style={styles.title}>About</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* App Info */}
                <View style={styles.appInfo}>
                    <View style={styles.appIconContainer}>
                        <Icon name="shield-link" size={40} color="#fff" />
                    </View>
                    <Text style={styles.appName}>LinkSafe</Text>
                    <Text style={styles.appTagline}>Secure Link Storage</Text>
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>Version {appVersion}</Text>
                    </View>
                </View>

                {/* Features */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <View style={styles.featuresCard}>
                        {features.map((feature, index) => (
                            <View key={index} style={styles.featureItem}>
                                <View style={styles.featureIconBg}>
                                    <Icon name={feature.icon} size={20} color={colors.primary} />
                                </View>
                                <View style={styles.featureContent}>
                                    <Text style={styles.featureTitle}>{feature.title}</Text>
                                    <Text style={styles.featureDescription}>{feature.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Info */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Information</Text>
                    <View style={styles.infoCard}>
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Developer</Text>
                            <Text style={styles.infoValue}>LinkSafe Team</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Version</Text>
                            <Text style={styles.infoValue}>{appVersion}</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.infoRow}>
                            <Text style={styles.infoLabel}>Build</Text>
                            <Text style={styles.infoValue}>2024.01</Text>
                        </View>
                    </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                    <Text style={styles.copyright}>© 2024 LinkSafe</Text>
                    <Text style={styles.footerText}>Made with ❤️ for secure link management</Text>
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
    appInfo: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    appIconContainer: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.xl,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
        ...shadows.lg,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.text,
        letterSpacing: -0.5,
    },
    appTagline: {
        fontSize: 15,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    versionBadge: {
        marginTop: spacing.md,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        backgroundColor: colors.primary + '15',
        borderRadius: borderRadius.full,
    },
    versionText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.primary,
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
    featuresCard: {
        backgroundColor: colors.backgroundLight,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    featureIconBg: {
        width: 40,
        height: 40,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary + '15',
        justifyContent: 'center',
        alignItems: 'center',
    },
    featureContent: {
        flex: 1,
        marginLeft: spacing.md,
    },
    featureTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.text,
    },
    featureDescription: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: 2,
    },
    infoCard: {
        backgroundColor: colors.backgroundLight,
        marginHorizontal: spacing.md,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    infoLabel: {
        fontSize: 15,
        color: colors.textSecondary,
    },
    infoValue: {
        fontSize: 15,
        fontWeight: '500',
        color: colors.text,
    },
    divider: {
        height: 1,
        backgroundColor: colors.border,
    },
    footer: {
        alignItems: 'center',
        padding: spacing.xl,
        marginTop: spacing.lg,
        marginBottom: spacing.xxl,
    },
    copyright: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    footerText: {
        fontSize: 13,
        color: colors.textMuted,
        marginTop: spacing.xs,
    },
});

export default AboutScreen;
