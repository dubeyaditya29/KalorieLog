import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { getProfile, updateProfile } from '../../../logic/services/api/profileService';
import { signOut } from '../../../logic/services/api/authService';
import { calculateBMI, getBMICategory, getBMIColor, calculateBMR, calculateCalorieGoal } from '../../../logic/utils/bmiCalculator';

export const ProfileScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [calorieGoal, setCalorieGoal] = useState('');

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const { data, error } = await getProfile(user.id);

            if (error) {
                console.error('Load profile error:', error);
                return;
            }

            if (data) {
                setName(data.name || '');
                setAge(data.age?.toString() || '');
                setHeight(data.height_cm?.toString() || '');
                setWeight(data.weight_kg?.toString() || '');
                setCalorieGoal(data.calorie_goal?.toString() || '2300');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name || !age || !height || !weight) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setSaving(true);

        try {
            const { error } = await updateProfile(user.id, {
                name,
                age: parseInt(age),
                height_cm: parseFloat(height),
                weight_kg: parseFloat(weight),
                calorie_goal: parseInt(calorieGoal) || 2300,
            });

            if (error) {
                Alert.alert('Error', error.message);
            } else {
                Alert.alert('Success', 'Profile updated!');
            }
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleSignOut = async () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: async () => {
                        await signOut();
                    },
                },
            ]
        );
    };

    const getSuggestedCalories = () => {
        if (!weight || !height || !age) return 2300;
        const bmr = calculateBMR(parseFloat(weight), parseFloat(height), parseInt(age));
        return calculateCalorieGoal(bmr, 'moderate');
    };

    const currentBMI = height && weight
        ? calculateBMI(parseFloat(weight), parseFloat(height))
        : null;

    if (loading) {
        return (
            <View style={[globalStyles.safeArea, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                {/* BMI Card */}
                {currentBMI && (
                    <View style={styles.bmiCard}>
                        <Text style={styles.bmiLabel}>Your BMI</Text>
                        <Text style={[styles.bmiValue, { color: getBMIColor(currentBMI) }]}>
                            {currentBMI.toFixed(1)}
                        </Text>
                        <Text style={styles.bmiCategory}>{getBMICategory(currentBMI)}</Text>
                    </View>
                )}

                {/* Form */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                            placeholder="Your name"
                            placeholderTextColor={theme.colors.textTertiary}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Age</Text>
                        <TextInput
                            style={styles.input}
                            value={age}
                            onChangeText={setAge}
                            placeholder="25"
                            placeholderTextColor={theme.colors.textTertiary}
                            keyboardType="number-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Height (cm)</Text>
                        <TextInput
                            style={styles.input}
                            value={height}
                            onChangeText={setHeight}
                            placeholder="170"
                            placeholderTextColor={theme.colors.textTertiary}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Weight (kg)</Text>
                        <TextInput
                            style={styles.input}
                            value={weight}
                            onChangeText={setWeight}
                            placeholder="70"
                            placeholderTextColor={theme.colors.textTertiary}
                            keyboardType="decimal-pad"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <View style={styles.labelRow}>
                            <Text style={styles.label}>Daily Calorie Goal</Text>
                            <Text style={styles.suggestion}>
                                Suggested: {getSuggestedCalories()} cal (based on BMI)
                            </Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={calorieGoal}
                            onChangeText={setCalorieGoal}
                            placeholder="2300"
                            placeholderTextColor={theme.colors.textTertiary}
                            keyboardType="number-pad"
                        />
                    </View>

                    <TouchableOpacity
                        style={[globalStyles.button, styles.saveButton]}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator color={theme.colors.white} />
                        ) : (
                            <Text style={globalStyles.buttonText}>Save Changes</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[globalStyles.buttonOutline, styles.signOutButton]}
                        onPress={handleSignOut}
                    >
                        <Text style={styles.signOutText}>Sign Out</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    email: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    bmiCard: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
        ...theme.shadows.md,
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
        marginBottom: theme.spacing.xs,
    },
    bmiCategory: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: theme.spacing.lg,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    suggestion: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.primary,
        fontStyle: 'italic',
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
    saveButton: {
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.md,
    },
    signOutButton: {
        marginTop: theme.spacing.lg,
    },
    signOutText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.error,
    },
});
