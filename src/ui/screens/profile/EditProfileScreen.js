import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { getProfile, updateProfile } from '../../../logic/services/api/profileService';
import { useModal } from '../../components/common/ThemedModal';
import { UnitField } from '../../components/common/UnitField';
import { ChevronLeftIcon, FlameIcon } from '../../components/icons';
import { calculateBMR, calculateCalorieGoal } from '../../../logic/utils/bmiCalculator';
import { ACTIVITY_LEVELS } from '../../../logic/utils/macroGoals';

const GENDER_OPTIONS = [
    { key: 'male', label: 'Male' },
    { key: 'female', label: 'Female' },
];

const digitsOnly = (setter) => (text) => setter(text.replace(/[^0-9]/g, ''));

export const EditProfileScreen = ({ navigation }) => {
    const { user, refreshProfile } = useAuth();
    const { showAlert } = useModal();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [heightCm, setHeightCm] = useState(null);
    const [weightKg, setWeightKg] = useState(null);
    const [activityLevel, setActivityLevel] = useState('moderate');
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
                if (data.gender) setGender(data.gender);
                setHeightCm(data.height_cm ?? null);
                setWeightKg(data.weight_kg ?? null);
                if (data.activity_level) setActivityLevel(data.activity_level);
                setCalorieGoal(data.calorie_goal?.toString() || '');
            }
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const getSuggestedCalories = () => {
        const parsedAge = parseInt(age);
        if (!parsedAge || !heightCm || !weightKg) return null;
        const bmr = calculateBMR(weightKg, heightCm, parsedAge, gender);
        return calculateCalorieGoal(bmr, activityLevel);
    };

    const handleSave = async () => {
        const parsedAge = parseInt(age);

        if (!name.trim() || !parsedAge || !heightCm || !weightKg) {
            showAlert('Missing Information', 'Please fill in your name, age, height and weight.');
            return;
        }

        setSaving(true);

        try {
            const updates = {
                name: name.trim(),
                age: parsedAge,
                gender,
                height_cm: heightCm,
                weight_kg: weightKg,
                activity_level: activityLevel,
                calorie_goal: parseInt(calorieGoal) || getSuggestedCalories() || 2300,
            };

            const { error } = await updateProfile(user.id, updates);

            if (error) {
                showAlert('Oops!', error.message);
            } else {
                refreshProfile();
                showAlert('Saved!', 'Your personal details have been updated.', () =>
                    navigation.goBack()
                );
            }
        } catch (error) {
            showAlert('Something Went Wrong', error.message);
        } finally {
            setSaving(false);
        }
    };

    const suggested = getSuggestedCalories();

    if (loading) {
        return (
            <SafeAreaView style={[globalStyles.safeArea, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <ChevronLeftIcon size={22} color={theme.colors.text} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Personal Details</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
            >
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
                        onChangeText={digitsOnly(setAge)}
                        placeholder="25"
                        placeholderTextColor={theme.colors.textTertiary}
                        keyboardType="number-pad"
                        maxLength={3}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.chipRow}>
                        {GENDER_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.key}
                                style={[styles.chip, gender === option.key && styles.chipActive]}
                                onPress={() => setGender(option.key)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        gender === option.key && styles.chipTextActive,
                                    ]}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <UnitField
                    label="Height"
                    kind="height"
                    canonicalValue={heightCm}
                    onChange={setHeightCm}
                />

                <UnitField
                    label="Weight"
                    kind="weight"
                    canonicalValue={weightKg}
                    onChange={setWeightKg}
                />

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Activity Level</Text>
                    <View style={styles.chipRowWrap}>
                        {ACTIVITY_LEVELS.map((a) => (
                            <TouchableOpacity
                                key={a.key}
                                style={[styles.chipSmall, activityLevel === a.key && styles.chipActive]}
                                onPress={() => setActivityLevel(a.key)}
                            >
                                <Text
                                    style={[
                                        styles.chipText,
                                        activityLevel === a.key && styles.chipTextActive,
                                    ]}
                                >
                                    {a.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    {(() => {
                        const selected = ACTIVITY_LEVELS.find((a) => a.key === activityLevel);
                        return selected ? (
                            <Text style={styles.hint}>{selected.hint}</Text>
                        ) : null;
                    })()}
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.labelRow}>
                        <Text style={styles.label}>Daily Calorie Goal</Text>
                        {suggested ? (
                            <TouchableOpacity onPress={() => setCalorieGoal(String(suggested))}>
                                <Text style={styles.suggestion}>Suggested: {suggested} cal</Text>
                            </TouchableOpacity>
                        ) : null}
                    </View>
                    <TextInput
                        style={styles.input}
                        value={calorieGoal}
                        onChangeText={digitsOnly(setCalorieGoal)}
                        placeholder={suggested ? String(suggested) : '2300'}
                        placeholderTextColor={theme.colors.textLight}
                        keyboardType="number-pad"
                    />
                    {!calorieGoal && (
                        <View style={styles.autoNote}>
                            <FlameIcon size={13} color={theme.colors.primary} />
                            <Text style={styles.autoNoteText}>
                                Leave empty to keep it auto-calculated for you
                            </Text>
                        </View>
                    )}
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
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    backButton: {
        width: 38,
        height: 38,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    headerSpacer: {
        width: 38,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
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
        marginBottom: theme.spacing.sm,
    },
    suggestion: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.medium,
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
    chipRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    chipRowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
    },
    chip: {
        flex: 1,
        paddingVertical: theme.spacing.sm + 2,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.backgroundSecondary,
        alignItems: 'center',
    },
    chipSmall: {
        paddingHorizontal: theme.spacing.md - 2,
        paddingVertical: theme.spacing.sm - 1,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    chipActive: {
        backgroundColor: theme.colors.primarySoft,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    chipTextActive: {
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
    },
    hint: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textTertiary,
        marginTop: theme.spacing.sm,
        marginLeft: theme.spacing.xs,
    },
    autoNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: theme.spacing.sm,
        marginLeft: theme.spacing.xs,
    },
    autoNoteText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textTertiary,
        fontStyle: 'italic',
    },
    saveButton: {
        marginTop: theme.spacing.md,
    },
});
