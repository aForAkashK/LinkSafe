// Password Modal Component - For entering/setting passwords
import React, { useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { colors, spacing, borderRadius, typography } from '../theme/colors';

interface PasswordModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (password: string) => void;
    mode: 'enter' | 'set' | 'confirm';
    title?: string;
    error?: string;
}

const PasswordModal: React.FC<PasswordModalProps> = ({
    visible,
    onClose,
    onSubmit,
    mode,
    title,
    error,
}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [localError, setLocalError] = useState('');

    const getTitle = () => {
        if (title) return title;
        switch (mode) {
            case 'enter':
                return 'Enter Password';
            case 'set':
                return 'Set Password';
            case 'confirm':
                return 'Confirm Password';
            default:
                return 'Password';
        }
    };

    const handleSubmit = () => {
        if (!password.trim()) {
            setLocalError('Please enter a password');
            return;
        }
        if (mode === 'set' && password.length < 4) {
            setLocalError('Password must be at least 4 characters');
            return;
        }
        if (mode === 'set' && password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }
        setLocalError('');
        onSubmit(password);
        setPassword('');
        setConfirmPassword('');
    };

    const handleClose = () => {
        setPassword('');
        setConfirmPassword('');
        setLocalError('');
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={handleClose}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Icon name="shield-lock" size={40} color={colors.primary} />
                        <Text style={styles.title}>{getTitle()}</Text>
                    </View>

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter password"
                            placeholderTextColor={colors.textMuted}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                            autoFocus
                        />
                        <TouchableOpacity
                            style={styles.eyeButton}
                            onPress={() => setShowPassword(!showPassword)}>
                            <Icon
                                name={showPassword ? 'eye-off' : 'eye'}
                                size={22}
                                color={colors.textSecondary}
                            />
                        </TouchableOpacity>
                    </View>

                    {mode === 'set' && (
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm password"
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry={!showPassword}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                        </View>
                    )}

                    {(error || localError) && (
                        <Text style={styles.errorText}>{error || localError}</Text>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, styles.cancelButton]}
                            onPress={handleClose}>
                            <Text style={styles.cancelButtonText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, styles.submitButton]}
                            onPress={handleSubmit}>
                            <Text style={styles.submitButtonText}>
                                {mode === 'set' ? 'Set Password' : 'Unlock'}
                            </Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: colors.card,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    title: {
        ...typography.h2,
        marginTop: spacing.md,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.backgroundLight,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    input: {
        flex: 1,
        ...typography.body,
        padding: spacing.md,
    },
    eyeButton: {
        padding: spacing.md,
    },
    errorText: {
        ...typography.caption,
        color: colors.error,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.md,
        marginTop: spacing.sm,
    },
    button: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: colors.backgroundLight,
        borderWidth: 1,
        borderColor: colors.border,
    },
    cancelButtonText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    submitButton: {
        backgroundColor: colors.primary,
    },
    submitButtonText: {
        ...typography.body,
        fontWeight: '600',
        color: colors.text,
    },
});

export default PasswordModal;
