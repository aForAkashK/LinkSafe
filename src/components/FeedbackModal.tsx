// Feedback Modal Component - Clean & Sleek Design
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    Linking,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
    ToastAndroid,
} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

interface FeedbackModalProps {
    visible: boolean;
    onClose: () => void;
}

const SUPPORT_EMAIL = 'support@linksafe.app'; // Update with your email

const FeedbackModal: React.FC<FeedbackModalProps> = ({
    visible,
    onClose,
}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleSendFeedback = async () => {
        if (!title.trim() || !description.trim()) {
            return;
        }

        const subject = encodeURIComponent(`LinkSafe Feedback: ${title}`);
        const body = encodeURIComponent(
            `${description}\n\n---\nSent from LinkSafe App`
        );
        const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

        try {
            await Linking.openURL(mailtoUrl);

            // On some platforms, we can't be sure it actually opened, 
            // but we can clear and close if no error was thrown
            setTitle('');
            setDescription('');
            onClose();
        } catch (error) {
            console.error('Error opening mail app:', error);

            // Fallback: Copy to clipboard and inform user
            Clipboard.setString(SUPPORT_EMAIL);

            if (Platform.OS === 'android') {
                ToastAndroid.show(`Email copied to clipboard`, ToastAndroid.LONG);
            }

            Alert.alert(
                'No Email App Found',
                `We couldn't open your mail app automatically.\n\nPlease send your feedback to:\n\n${SUPPORT_EMAIL}\n\n(The email address has been copied to your clipboard)`,
                [{ text: 'OK' }]
            );
        }
    };

    const handleClose = () => {
        setTitle('');
        setDescription('');
        onClose();
    };

    const isValid = title.trim().length > 0 && description.trim().length > 0;

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
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>Send Feedback</Text>
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={handleClose}
                            activeOpacity={0.7}>
                            <Icon name="close" size={24} color={colors.textSecondary} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                        {/* Info Card */}
                        <View style={styles.infoCard}>
                            <Icon name="heart-outline" size={24} color={colors.primary} />
                            <Text style={styles.infoText}>
                                Your feedback is incredibly valuable to us! As a free app, we rely on your suggestions to improve LinkSafe and make it the best link manager for everyone.
                            </Text>
                        </View>

                        {/* Title Input */}
                        <Text style={styles.label}>Title</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g., Feature request, Bug report"
                            placeholderTextColor={colors.textMuted}
                            value={title}
                            onChangeText={setTitle}
                            maxLength={100}
                        />

                        {/* Description Input */}
                        <Text style={styles.label}>Description</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            placeholder="Tell us what's on your mind..."
                            placeholderTextColor={colors.textMuted}
                            value={description}
                            onChangeText={setDescription}
                            multiline
                            numberOfLines={5}
                            textAlignVertical="top"
                            maxLength={1000}
                        />

                        {/* Character count */}
                        <Text style={styles.charCount}>
                            {description.length}/1000
                        </Text>
                    </ScrollView>

                    {/* Send Button */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.sendButton,
                                !isValid && styles.sendButtonDisabled,
                            ]}
                            onPress={handleSendFeedback}
                            disabled={!isValid}
                            activeOpacity={0.7}>
                            <Icon name="email-send-outline" size={20} color="#fff" />
                            <Text style={styles.sendButtonText}>Send via Email</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: colors.background,
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
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
    },
    closeButton: {
        padding: spacing.xs,
    },
    content: {
        padding: spacing.lg,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: colors.primary + '10',
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.primary + '20',
        gap: spacing.md,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: colors.textSecondary,
        lineHeight: 19,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    input: {
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: 15,
        color: colors.text,
        borderWidth: 1,
        borderColor: colors.border,
    },
    textArea: {
        minHeight: 120,
        textAlignVertical: 'top',
    },
    charCount: {
        fontSize: 12,
        color: colors.textMuted,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    buttonContainer: {
        padding: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    sendButton: {
        flexDirection: 'row',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.sm,
    },
    sendButtonDisabled: {
        backgroundColor: colors.textMuted,
        opacity: 0.6,
    },
    sendButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});

export default FeedbackModal;
