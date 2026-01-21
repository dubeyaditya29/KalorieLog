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
    Image,
} from 'react-native';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { signInWithEmail, signUpWithEmail } from '../../services/api/authService';
import { logoIcon } from '../../assets';

export const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        try {
            if (isSignUp) {
                const { data, error } = await signUpWithEmail(email, password);

                if (error) {
                    Alert.alert('Sign Up Failed', error.message);
                } else {
                    // Since email confirmation is disabled, sign in immediately
                    const { data: signInData, error: signInError } = await signInWithEmail(email, password);
                    if (signInError) {
                        Alert.alert('Success', 'Account created! Please sign in.');
                        setIsSignUp(false);
                    }
                    // If successful, AuthContext will handle navigation
                }
            } else {
                const { data, error } = await signInWithEmail(email, password);

                if (error) {
                    Alert.alert('Sign In Failed', error.message);
                }
                // If successful, AuthContext will handle navigation
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
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
                        <Text style={styles.subtitle}>
                            {isSignUp ? 'Create your account' : 'Welcome back'}
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="your@email.com"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                                autoComplete="email"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                autoComplete="password"
                            />
                        </View>

                        <TouchableOpacity
                            style={[globalStyles.button, styles.authButton]}
                            onPress={handleAuth}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={theme.colors.white} />
                            ) : (
                                <Text style={globalStyles.buttonText}>
                                    {isSignUp ? 'Sign Up' : 'Sign In'}
                                </Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.switchButton}
                            onPress={() => setIsSignUp(!isSignUp)}
                        >
                            <Text style={styles.switchText}>
                                {isSignUp
                                    ? 'Already have an account? Sign In'
                                    : "Don't have an account? Sign Up"}
                            </Text>
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
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    authButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
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
});
