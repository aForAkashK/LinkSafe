// Action Modal Component - Clean & Sleek Design
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

interface ActionOption {
    icon: string;
    label: string;
    onPress: () => void;
    danger?: boolean;
}

interface ActionModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    subtitle?: string;
    options: ActionOption[];
}

const ActionModal: React.FC<ActionModalProps> = ({
    visible,
    onClose,
    title,
    subtitle,
    options,
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
                            {/* Header */}
                            <View style={styles.header}>
                                <Text style={styles.title} numberOfLines={1}>{title}</Text>
                                {subtitle && (
                                    <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>
                                )}
                            </View>

                            {/* Options */}
                            <View style={styles.optionsContainer}>
                                {options.map((option, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[
                                            styles.option,
                                            index < options.length - 1 && styles.optionBorder,
                                        ]}
                                        onPress={() => {
                                            onClose();
                                            option.onPress();
                                        }}
                                        activeOpacity={0.7}>
                                        <View style={[
                                            styles.optionIconBg,
                                            { backgroundColor: option.danger ? colors.error + '15' : colors.primary + '15' }
                                        ]}>
                                            <Icon
                                                name={option.icon}
                                                size={20}
                                                color={option.danger ? colors.error : colors.primary}
                                            />
                                        </View>
                                        <Text style={[
                                            styles.optionText,
                                            option.danger && styles.dangerText,
                                        ]}>
                                            {option.label}
                                        </Text>
                                        <Icon
                                            name="chevron-right"
                                            size={20}
                                            color={colors.textMuted}
                                        />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Cancel Button */}
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={onClose}
                                activeOpacity={0.7}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
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
        justifyContent: 'flex-end',
        padding: spacing.md,
    },
    container: {
        backgroundColor: colors.background,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.lg,
    },
    header: {
        padding: spacing.lg,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.text,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 13,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 4,
    },
    optionsContainer: {
        paddingVertical: spacing.sm,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
    },
    optionBorder: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    optionIconBg: {
        width: 36,
        height: 36,
        borderRadius: borderRadius.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.md,
    },
    optionText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: colors.text,
    },
    dangerText: {
        color: colors.error,
    },
    cancelButton: {
        padding: spacing.lg,
        alignItems: 'center',
        backgroundColor: colors.backgroundLight,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    cancelText: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textSecondary,
    },
});

export default ActionModal;
