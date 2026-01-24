import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { upsertProfile } from '../../../logic/services/api/profileService';
import { calculateBMR, calculateCalorieGoal, calculateBMI, getBMICategory } from '../../../logic/utils/bmiCalculator';

export const OnboardingScreen = () => {
    const { user } = useAuth();
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [loading, setLoading] = useState(false);

    const handleComplete = async () => {
        if (!name || !age || !height || !weight) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        const ageNum = parseInt(age);
        const heightNum = parseFloat(height);
        const weightNum = parseFloat(weight);

        if (ageNum < 1 || ageNum > 120) {
            Alert.alert('Error', 'Please enter a valid age');
            return;
        }

        if (heightNum < 50 || heightNum > 300) {
            Alert.alert('Error', 'Please enter a valid height (50-300 cm)');
            return;
        }

        if (weightNum < 20 || weightNum > 500) {
            Alert.alert('Error', 'Please enter a valid weight (20-500 kg)');
            return;
        }

        setLoading(true);
        console.log('Starting profile creation...');
        console.log('User ID:', user?.id);

        try {
            // Calculate BMR and calorie goal
            const bmr = calculateBMR(weightNum, heightNum, ageNum);
            const calorieGoal = calculateCalorieGoal(bmr, 'moderate');

            console.log('Calculated BMR:', bmr);
            console.log('Calculated calorie goal:', calorieGoal);

            const profileData = {
                email: user.email,
                name,
                age: ageNum,
                height_cm: heightNum,
                weight_kg: weightNum,
                calorie_goal: calorieGoal,
            };

            console.log('Profile data:', profileData);

            const { data, error } = await upsertProfile(user.id, profileData);

            console.log('Upsert result:', { data, error });

            if (error) {
                console.error('Profile creation error:', error);
                Alert.alert('Error', error.message || 'Failed to create profile');
            } else {
                console.log('Profile created successfully!');
                Alert.alert('Success', 'Profile created! Loading app...');
            }
            // If successful, AuthContext will trigger re-render
        } catch (error) {
            console.error('Unexpected error:', error);
            Alert.alert('Error', error.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    // Calculate preview BMI
    const previewBMI = height && weight
        ? calculateBMI(parseFloat(weight), parseFloat(height))
        : null;

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.icon}>👤</Text>
                        <Text style={styles.title}>Complete Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Help us personalize your calorie tracking
                        </Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Your name"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Age</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="25"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={age}
                                onChangeText={setAge}
                                keyboardType="number-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Height (cm)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="170"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={height}
                                onChangeText={setHeight}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.label}>Weight (kg)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="70"
                                placeholderTextColor={theme.colors.textTertiary}
                                value={weight}
                                onChangeText={setWeight}
                                keyboardType="decimal-pad"
                            />
                        </View>

                        {/* BMI Preview */}
                        {previewBMI && (
                            <View style={styles.bmiPreview}>
                                <Text style={styles.bmiLabel}>Your BMI</Text>
                                <Text style={styles.bmiValue}>{previewBMI.toFixed(1)}</Text>
                                <Text style={styles.bmiCategory}>
                                    {getBMICategory(previewBMI)}
                                </Text>
                            </View>
                        )}

                        <TouchableOpacity
                            style={[globalStyles.button, styles.completeButton]}
                            onPress={handleComplete}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={theme.colors.white} />
                            ) : (
                                <Text style={globalStyles.buttonText}>Complete Setup</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.xxl,
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
        marginBottom: theme.spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
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
    bmiPreview: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    bmiLabel: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    bmiValue: {
        fontSize: theme.fontSize.huge,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.xs,
    },
    bmiCategory: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.medium,
    },
    completeButton: {
        marginTop: theme.spacing.md,
    },
});
