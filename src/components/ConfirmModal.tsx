// Confirm Modal Component - Clean & Sleek Design
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, shadows } from '../theme/colors';

interface ConfirmModalProps {
    visible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    danger?: boolean;
    icon?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    visible,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    icon,
}) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <TouchableWithoutFeedback>
                        <View style={styles.container}>
                            {/* Icon */}
                            {icon && (
                                <View style={[
                                    styles.iconContainer,
                                    { backgroundColor: danger ? colors.error + '15' : colors.primary + '15' }
                                ]}>
                                    <Icon
                                        name={icon}
                                        size={28}
                                        color={danger ? colors.error : colors.primary}
                                    />
                                </View>
                            )}

                            {/* Content */}
                            <Text style={styles.title}>{title}</Text>
                            <Text style={styles.message}>{message}</Text>

                            {/* Actions */}
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.cancelButton}
                                    onPress={onClose}
                                    activeOpacity={0.7}>
                                    <Text style={styles.cancelText}>{cancelText}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[
                                        styles.confirmButton,
                                        danger && styles.dangerButton,
                                    ]}
                                    onPress={() => {
                                        onConfirm();
                                        onClose();
                                    }}
                                    activeOpacity={0.7}>
                                    <Text style={[
                                        styles.confirmText,
                                        danger && styles.dangerText,
                                    ]}>
                                        {confirmText}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.lg,
    },
    container: {
        width: '100%',
        maxWidth: 340,
        backgroundColor: colors.background,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        alignItems: 'center',
        ...shadows.lg,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    message: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: spacing.lg,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.sm,
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.backgroundLight,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelText: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.md,
        backgroundColor: colors.primary,
        alignItems: 'center',
    },
    confirmText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    dangerButton: {
        backgroundColor: colors.error,
    },
    dangerText: {
        color: '#fff',
    },
});

export default ConfirmModal;
