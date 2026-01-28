import React, { useState, useRef } from 'react';
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
    Image,
    Animated,
    Modal,
} from 'react-native';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import {
    signInWithEmail,
    signUpWithEmail,
    sendPasswordResetEmail,
    getEmailByPhone,
} from '../../../logic/services/api/authService';
import {
    AUTH_MESSAGES,
    getAuthErrorMessage
} from '../../../logic/constants/messages';
import { logoIcon } from '../../assets';

// Flow states
const FLOW_STATES = {
    LOGIN: 'LOGIN',
    SIGNUP: 'SIGNUP',
    FORGOT_PASSWORD: 'FORGOT_PASSWORD',
    FORGOT_EMAIL: 'FORGOT_EMAIL',
};

// Custom themed modal component
const ThemedModal = ({ visible, title, message, buttons, onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={modalStyles.overlay}>
                <View style={modalStyles.container}>
                    {title && <Text style={modalStyles.title}>{title}</Text>}
                    {message && <Text style={modalStyles.message}>{message}</Text>}
                    <View style={modalStyles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    modalStyles.button,
                                    button.primary && modalStyles.buttonPrimary,
                                    button.secondary && modalStyles.buttonSecondary,
                                ]}
                                onPress={() => {
                                    onClose();
                                    button.onPress?.();
                                }}
                            >
                                <Text style={[
                                    modalStyles.buttonText,
                                    button.primary && modalStyles.buttonTextPrimary,
                                ]}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const modalStyles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    container: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        width: '100%',
        maxWidth: 320,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    title: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    message: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: theme.spacing.xl,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: theme.spacing.sm,
    },
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundTertiary,
        alignItems: 'center',
    },
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
    },
    buttonSecondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    buttonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
    },
    buttonTextPrimary: {
        color: theme.colors.white,
    },
});

// Email validation helper
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
};

export const LoginScreen = ({ navigation }) => {
    const [flowState, setFlowState] = useState(FLOW_STATES.LOGIN);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    // Modal state
    const [modalVisible, setModalVisible] = useState(false);
    const [modalConfig, setModalConfig] = useState({
        title: '',
        message: '',
        buttons: [{ text: 'OK', primary: true }],
    });

    // Animation values
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Show themed modal
    const showModal = (title, message, buttons = [{ text: 'OK', primary: true }]) => {
        setModalConfig({ title, message, buttons });
        setModalVisible(true);
    };

    // Animate flow state transitions
    const animateTransition = (newState) => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 150,
                useNativeDriver: true,
            }),
        ]).start();

        setTimeout(() => {
            setFlowState(newState);
            setConfirmPassword('');
        }, 150);
    };

    // Handle Login
    const handleLogin = async () => {
        if (!email || !isValidEmail(email)) {
            showModal(AUTH_MESSAGES.INVALID_EMAIL.title, AUTH_MESSAGES.INVALID_EMAIL.message);
            return;
        }

        if (!password || password.length < 6) {
            showModal(AUTH_MESSAGES.INVALID_PASSWORD.title, AUTH_MESSAGES.INVALID_PASSWORD.message);
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signInWithEmail(email, password);

            if (error) {
                const errorInfo = getAuthErrorMessage(error);

                // If user doesn't exist, offer to create account
                if (errorInfo.action === 'SIGNUP') {
                    showModal(errorInfo.title, errorInfo.message, [
                        { text: 'Cancel', secondary: true },
                        {
                            text: 'Create Account',
                            primary: true,
                            onPress: () => animateTransition(FLOW_STATES.SIGNUP)
                        },
                    ]);
                } else {
                    showModal(errorInfo.title, errorInfo.message);
                }
                return;
            }

            // AuthContext will handle navigation
            console.log('Login successful');
        } catch (error) {
            const errorInfo = getAuthErrorMessage(error);
            showModal(errorInfo.title, errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Sign Up
    const handleSignUp = async () => {
        if (!email || !isValidEmail(email)) {
            showModal(AUTH_MESSAGES.INVALID_EMAIL.title, AUTH_MESSAGES.INVALID_EMAIL.message);
            return;
        }

        if (!password || password.length < 6) {
            showModal(AUTH_MESSAGES.INVALID_PASSWORD.title, AUTH_MESSAGES.INVALID_PASSWORD.message);
            return;
        }

        if (password !== confirmPassword) {
            showModal(AUTH_MESSAGES.PASSWORD_MISMATCH.title, AUTH_MESSAGES.PASSWORD_MISMATCH.message);
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await signUpWithEmail(email, password);

            if (error) {
                const errorInfo = getAuthErrorMessage(error);

                // If user already exists, offer to login
                if (errorInfo.action === 'LOGIN') {
                    showModal(errorInfo.title, errorInfo.message, [
                        { text: 'Cancel', secondary: true },
                        {
                            text: 'Sign In',
                            primary: true,
                            onPress: () => animateTransition(FLOW_STATES.LOGIN)
                        },
                    ]);
                } else {
                    showModal(errorInfo.title, errorInfo.message);
                }
                return;
            }

            // Auto-login after signup
            const { data: loginData, error: loginError } = await signInWithEmail(email, password);

            if (loginError) {
                // Account created but couldn't auto-login
                showModal(AUTH_MESSAGES.ACCOUNT_CREATED.title, AUTH_MESSAGES.ACCOUNT_CREATED.message, [
                    {
                        text: 'Sign In',
                        primary: true,
                        onPress: () => animateTransition(FLOW_STATES.LOGIN)
                    },
                ]);
            }
            // AuthContext will handle navigation if login successful
        } catch (error) {
            const errorInfo = getAuthErrorMessage(error);
            showModal(errorInfo.title, errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Forgot Password
    const handleForgotPassword = async () => {
        if (!email || !isValidEmail(email)) {
            showModal(AUTH_MESSAGES.INVALID_EMAIL.title, AUTH_MESSAGES.INVALID_EMAIL.message);
            return;
        }

        setLoading(true);

        try {
            const { error } = await sendPasswordResetEmail(email);

            if (error) {
                const errorInfo = getAuthErrorMessage(error);
                showModal(errorInfo.title, errorInfo.message);
                return;
            }

            showModal(
                AUTH_MESSAGES.PASSWORD_RESET_SENT.title,
                `${AUTH_MESSAGES.PASSWORD_RESET_SENT.message}\n\nSent to: ${email}`,
                [{
                    text: 'Back to Login',
                    primary: true,
                    onPress: () => animateTransition(FLOW_STATES.LOGIN),
                }]
            );
        } catch (error) {
            const errorInfo = getAuthErrorMessage(error);
            showModal(errorInfo.title, errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    // Handle Forgot Email (phone lookup)
    const handleForgotEmail = async () => {
        if (!phoneNumber || phoneNumber.replace(/[^\d]/g, '').length < 10) {
            showModal(AUTH_MESSAGES.INVALID_PHONE.title, AUTH_MESSAGES.INVALID_PHONE.message);
            return;
        }

        setLoading(true);

        try {
            const { email: foundEmail, error } = await getEmailByPhone(phoneNumber);

            if (error) {
                const errorInfo = getAuthErrorMessage(error);
                showModal(errorInfo.title, errorInfo.message);
                return;
            }

            if (foundEmail) {
                showModal(
                    AUTH_MESSAGES.EMAIL_FOUND.title,
                    `Your registered email is:\n\n${foundEmail}`,
                    [{
                        text: 'Sign In',
                        primary: true,
                        onPress: () => {
                            setEmail(foundEmail);
                            setPhoneNumber('');
                            animateTransition(FLOW_STATES.LOGIN);
                        },
                    }]
                );
            } else {
                showModal(AUTH_MESSAGES.PHONE_NOT_FOUND.title, AUTH_MESSAGES.PHONE_NOT_FOUND.message);
            }
        } catch (error) {
            const errorInfo = getAuthErrorMessage(error);
            showModal(errorInfo.title, errorInfo.message);
        } finally {
            setLoading(false);
        }
    };

    // Switch between login and signup
    const toggleAuthMode = () => {
        animateTransition(flowState === FLOW_STATES.LOGIN ? FLOW_STATES.SIGNUP : FLOW_STATES.LOGIN);
    };

    // Check if email is valid for showing tick
    const emailIsValid = isValidEmail(email);

    // Render login/signup form
    const renderAuthForm = () => {
        const isSignUp = flowState === FLOW_STATES.SIGNUP;

        return (
            <View style={styles.form}>
                {/* Email Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Email Address</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, styles.inputWithIcon]}
                            placeholder="your@email.com"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            autoComplete="email"
                        />
                        {email.length > 0 && (
                            <View style={styles.validationIcon}>
                                {emailIsValid ? (
                                    <Text style={styles.validIcon}>✓</Text>
                                ) : (
                                    <Text style={styles.invalidIcon}>✗</Text>
                                )}
                            </View>
                        )}
                    </View>
                </View>

                {/* Password Input */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={[styles.input, styles.inputWithIcon]}
                            placeholder="••••••••"
                            placeholderTextColor={theme.colors.textTertiary}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={!showPassword}
                            autoComplete="password"
                        />
                        <TouchableOpacity
                            style={styles.eyeIcon}
                            onPress={() => setShowPassword(!showPassword)}
                        >
                            <Text style={styles.eyeIconText}>
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Confirm Password (Sign Up only) */}
                {isSignUp && (
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputWrapper}>
                            <TextInput
                                style={[styles.input, styles.inputWithIcon]}
                                placeholder="••••••••"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoComplete="password"
                            />
                            <TouchableOpacity
                                style={styles.eyeIcon}
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                <Text style={styles.eyeIconText}>
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}

                {/* Main Auth Button */}
                <TouchableOpacity
                    style={[globalStyles.button, styles.authButton]}
                    onPress={isSignUp ? handleSignUp : handleLogin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.colors.white} />
                    ) : (
                        <Text style={globalStyles.buttonText}>
                            {isSignUp ? 'Create Account' : 'Sign In'}
                        </Text>
                    )}
                </TouchableOpacity>

                {/* Forgot Password/Email Links (Login only) */}
                {!isSignUp && (
                    <View style={styles.forgotContainer}>
                        <TouchableOpacity onPress={() => animateTransition(FLOW_STATES.FORGOT_PASSWORD)}>
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>
                        <Text style={styles.forgotDivider}>•</Text>
                        <TouchableOpacity onPress={() => animateTransition(FLOW_STATES.FORGOT_EMAIL)}>
                            <Text style={styles.forgotText}>Forgot Email?</Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Toggle Auth Mode */}
                <TouchableOpacity style={styles.switchButton} onPress={toggleAuthMode}>
                    <Text style={styles.switchText}>
                        {isSignUp
                            ? 'Already have an account? Sign In'
                            : "Don't have an account? Sign Up"}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    // Render forgot password form
    const renderForgotPassword = () => (
        <View style={styles.form}>
            <Text style={styles.formTitle}>Reset Password</Text>
            <Text style={styles.formSubtitle}>
                Enter your email and we'll send you a link to reset your password
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={[styles.input, styles.inputWithIcon]}
                        placeholder="your@email.com"
                        placeholderTextColor={theme.colors.textTertiary}
                        value={email}
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        autoComplete="email"
                        autoFocus
                    />
                    {email.length > 0 && (
                        <View style={styles.validationIcon}>
                            {emailIsValid ? (
                                <Text style={styles.validIcon}>✓</Text>
                            ) : (
                                <Text style={styles.invalidIcon}>✗</Text>
                            )}
                        </View>
                    )}
                </View>
            </View>

            <TouchableOpacity
                style={[
                    globalStyles.button,
                    styles.authButton,
                    !emailIsValid && styles.buttonDisabled,
                ]}
                onPress={handleForgotPassword}
                disabled={loading || !emailIsValid}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.white} />
                ) : (
                    <Text style={globalStyles.buttonText}>Send Reset Link</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => animateTransition(FLOW_STATES.LOGIN)}>
                <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
        </View>
    );

    // Render forgot email form
    const renderForgotEmail = () => (
        <View style={styles.form}>
            <Text style={styles.formTitle}>Find Your Email</Text>
            <Text style={styles.formSubtitle}>
                Enter your registered phone number and we'll show you the associated email
            </Text>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                    style={styles.input}
                    placeholder="+1 234 567 8900"
                    placeholderTextColor={theme.colors.textTertiary}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                    keyboardType="phone-pad"
                    autoComplete="tel"
                    autoFocus
                />
            </View>

            <TouchableOpacity
                style={[globalStyles.button, styles.authButton]}
                onPress={handleForgotEmail}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color={theme.colors.white} />
                ) : (
                    <Text style={globalStyles.buttonText}>Find My Email</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.backButton} onPress={() => animateTransition(FLOW_STATES.LOGIN)}>
                <Text style={styles.backText}>← Back to Login</Text>
            </TouchableOpacity>
        </View>
    );

    // Get content based on flow state
    const renderContent = () => {
        switch (flowState) {
            case FLOW_STATES.FORGOT_PASSWORD:
                return renderForgotPassword();
            case FLOW_STATES.FORGOT_EMAIL:
                return renderForgotEmail();
            default:
                return renderAuthForm();
        }
    };

    // Get subtitle based on flow state
    const getSubtitle = () => {
        switch (flowState) {
            case FLOW_STATES.SIGNUP:
                return 'Create your account';
            case FLOW_STATES.FORGOT_PASSWORD:
                return "We'll help you recover";
            case FLOW_STATES.FORGOT_EMAIL:
                return "Let's find your account";
            default:
                return 'Welcome back';
        }
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <View style={styles.content}>
                    {/* Logo/Title */}
                    <View style={styles.header}>
                        <Image source={logoIcon} style={styles.logo} />
                        <View style={styles.titleContainer}>
                            <Text style={styles.titleK}>K</Text>
                            <Text style={styles.titleAlorie}>alorie</Text>
                            <Text style={styles.titleLog}>Log</Text>
                        </View>
                        <Text style={styles.tagline}>Track. Analyze. Transform.</Text>
                        <Text style={styles.subtitle}>{getSubtitle()}</Text>
                    </View>

                    {/* Animated Content */}
                    <Animated.View style={{ opacity: fadeAnim }}>
                        {renderContent()}
                    </Animated.View>
                </View>
            </KeyboardAvoidingView>

            {/* Themed Modal */}
            <ThemedModal
                visible={modalVisible}
                title={modalConfig.title}
                message={modalConfig.message}
                buttons={modalConfig.buttons}
                onClose={() => setModalVisible(false)}
            />
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
    logo: {
        width: 90,
        height: 90,
        marginBottom: theme.spacing.lg,
        tintColor: '#30D158',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
        marginBottom: theme.spacing.xs,
    },
    titleK: {
        fontSize: 42,
        fontWeight: '900',
        color: '#30D158',
        letterSpacing: -2,
    },
    titleAlorie: {
        fontSize: 42,
        fontWeight: '300',
        color: '#FFFFFF',
        letterSpacing: -1,
    },
    titleLog: {
        fontSize: 42,
        fontWeight: '800',
        color: '#0A84FF',
        letterSpacing: -1,
    },
    tagline: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        letterSpacing: 3,
        textTransform: 'uppercase',
        marginBottom: theme.spacing.lg,
    },
    subtitle: {
        fontSize: theme.fontSize.lg,
        color: theme.colors.textSecondary,
    },
    form: {
        width: '100%',
    },
    formTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
    },
    formSubtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
        lineHeight: 22,
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
    inputWrapper: {
        position: 'relative',
    },
    input: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    inputWithIcon: {
        paddingRight: 50,
    },
    validationIcon: {
        position: 'absolute',
        right: 16,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    validIcon: {
        fontSize: 20,
        color: theme.colors.success,
        fontWeight: theme.fontWeight.bold,
    },
    invalidIcon: {
        fontSize: 20,
        color: theme.colors.error,
        fontWeight: theme.fontWeight.bold,
    },
    eyeIcon: {
        position: 'absolute',
        right: 12,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    eyeIconText: {
        fontSize: 18,
    },
    authButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    forgotContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    forgotText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.medium,
    },
    forgotDivider: {
        marginHorizontal: theme.spacing.sm,
        color: theme.colors.textTertiary,
    },
    switchButton: {
        alignItems: 'center',
        padding: theme.spacing.md,
    },
    switchText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.medium,
    },
    backButton: {
        alignItems: 'center',
        padding: theme.spacing.md,
        marginTop: theme.spacing.sm,
    },
    backText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.medium,
    },
});
