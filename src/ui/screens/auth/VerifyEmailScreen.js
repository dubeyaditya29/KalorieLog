import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { verifyEmail, resendVerificationCode } from '../../../logic/services/api/authService';

export const VerifyEmailScreen = ({ route, navigation }) => {
    const { email } = route.params;
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async () => {
        if (!code || code.length !== 6) {
            Alert.alert('Error', 'Please enter a valid 6-digit code');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await verifyEmail(email, code);

            if (error) {
                Alert.alert('Verification Failed', error.message);
            }
            // If successful, AuthContext will handle navigation
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);

        try {
            const { error } = await resendVerificationCode(email);

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Success', 'Verification code sent to your email');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setResending(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.icon}>📧</Text>
                        <Text style={styles.title}>Verify Your Email</Text>
                        <Text style={styles.subtitle}>
                            We sent a 6-digit code to{'\n'}
                            <Text style={styles.email}>{email}</Text>
                        </Text>
                    </View>

                    {/* Code Input */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Verification Code</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="000000"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={code}
                                onChangeText={setCode}
                                keyboardType="number-pad"
                                maxLength={6}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={[globalStyles.button, styles.verifyButton]}
                            onPress={handleVerify}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={theme.colors.white} />
                            ) : (
                                <Text style={globalStyles.buttonText}>Verify Email</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.resendButton}
                            onPress={handleResend}
                            disabled={resending}
                        >
                            {resending ? (
                                <ActivityIndicator size="small" color={theme.colors.primary} />
                            ) : (
                                <Text style={styles.resendText}>Resend Code</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backText}>← Back to Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.xl,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.xxl,
    },
    icon: {
        fontSize: 80,
        marginBottom: theme.spacing.md,
    },
    title: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
    },
    email: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: theme.spacing.lg,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    input: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.fontSize.xxl,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
        textAlign: 'center',
        letterSpacing: 8,
        fontWeight: theme.fontWeight.bold,
    },
    verifyButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    resendButton: {
        alignItems: 'center',
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    resendText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.medium,
    },
    backButton: {
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    backText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
});
