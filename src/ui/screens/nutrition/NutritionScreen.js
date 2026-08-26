import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useHeaderHeight } from '@react-navigation/elements';
import { theme, getMealTypeColor } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { getProfile, upsertProfile } from '../../../logic/services/api/profileService';
import { getMealsByDate, getTotalCaloriesByDate } from '../../../logic/services/storageService';
import { getMacroSuggestions, ACTIVITY_LEVELS } from '../../../logic/utils/macroGoals';
import { CircularProgress, UnitField, MealCard } from '../../components';
import {
    CameraIcon,
    BreakfastIcon,
    LunchIcon,
    DinnerIcon,
    SnackIcon,
} from '../../components/icons';

const MEAL_TYPE_ICONS = {
    breakfast: BreakfastIcon,
    lunch: LunchIcon,
    dinner: DinnerIcon,
    snack: SnackIcon,
};

const MEAL_SECTIONS = [
    { key: 'breakfast', label: 'Breakfast' },
    { key: 'lunch', label: 'Lunch' },
    { key: 'dinner', label: 'Dinner' },
    { key: 'snack', label: 'Snacks' },
];

export const NutritionScreen = ({ navigation }) => {
    const { user, refreshProfile } = useAuth();
    const headerHeight = useHeaderHeight();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form state
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('male');
    const [activityLevel, setActivityLevel] = useState('moderate');
    const [heightCm, setHeightCm] = useState(null);
    const [weightKg, setWeightKg] = useState(null);

    // Dashboard state
    const [meals, setMeals] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        loadProfile();
    }, []);

    const hasCompleteProfile = !!(profile && profile.name && profile.age && profile.height_cm && profile.weight_kg);

    const loadProfile = async () => {
        try {
            const { data } = await getProfile(user.id);
            if (data) {
                setProfile(data);
                setName(data.name || '');
                setAge(data.age?.toString() || '');
                if (data.gender) setGender(data.gender);
                if (data.activity_level) setActivityLevel(data.activity_level);
            }
        } finally {
            setLoading(false);
        }
    };

    const loadDashboardData = async (date = selectedDate) => {
        try {
            const dayMeals = await getMealsByDate(date);
            const total = await getTotalCaloriesByDate(date);
            setMeals(dayMeals);
            setTotalCalories(total);
        } catch (error) {
            console.error('Error loading meals:', error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            if (hasCompleteProfile) {
                loadDashboardData(selectedDate);
            }
        }, [selectedDate, profile])
    );

    const suggestions = hasCompleteProfile ? getMacroSuggestions(profile) : null;
    const formPreview = (!hasCompleteProfile && age && heightCm && weightKg)
        ? getMacroSuggestions({ age: parseInt(age), height_cm: heightCm, weight_kg: weightKg, gender, activity_level: activityLevel })
        : null;

    const handleSaveProfile = async () => {
        if (!name.trim() || !age || !heightCm || !weightKg) return;

        setSaving(true);
        try {
            const preview = getMacroSuggestions({
                age: parseInt(age),
                height_cm: heightCm,
                weight_kg: weightKg,
                gender,
                activity_level: activityLevel,
            });

            const { error } = await upsertProfile(user.id, {
                name: name.trim(),
                age: parseInt(age),
                height_cm: heightCm,
                weight_kg: weightKg,
                gender,
                activity_level: activityLevel,
                calorie_goal: preview ? preview.calorieGoal : 2300,
            });

            if (error) throw error;

            await loadProfile();
            refreshProfile();
        } catch (error) {
            console.error('Error saving profile:', error);
        } finally {
            setSaving(false);
        }
    };

    // ---------- Setup form ----------
    if (loading) {
        return (
            <View style={[globalStyles.centered, styles.flex1, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!hasCompleteProfile) {
        return (
            <SafeAreaView style={globalStyles.safeArea}>
                <KeyboardAvoidingView
                    style={styles.flex1}
                    behavior="padding"
                    keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
                >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.formContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <Text style={styles.formTitle}>Welcome 👋</Text>
                    <Text style={styles.formSubtitle}>
                        Tell us about yourself to get personalized calorie and macro targets.
                    </Text>

                    <Text style={styles.fieldLabel}>Name</Text>
                    <TextInput
                        style={styles.input}
                        value={name}
                        onChangeText={setName}
                        placeholder="Your name"
                        placeholderTextColor={theme.colors.textLight}
                    />

                    <Text style={styles.fieldLabel}>Age</Text>
                    <TextInput
                        style={styles.input}
                        value={age}
                        onChangeText={(t) => setAge(t.replace(/[^0-9]/g, ''))}
                        placeholder="Years"
                        placeholderTextColor={theme.colors.textLight}
                        keyboardType="number-pad"
                        maxLength={3}
                    />

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

                    <Text style={styles.fieldLabel}>Gender</Text>
                    <View style={styles.chipRow}>
                        {['male', 'female'].map((g) => (
                            <TouchableOpacity
                                key={g}
                                style={[styles.chip, gender === g && styles.chipActive]}
                                onPress={() => setGender(g)}
                            >
                                <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
                                    {g === 'male' ? 'Male' : 'Female'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Text style={styles.fieldLabel}>Activity level</Text>
                    <View style={styles.chipRowWrap}>
                        {ACTIVITY_LEVELS.map((a) => (
                            <TouchableOpacity
                                key={a.key}
                                style={[styles.chipSmall, activityLevel === a.key && styles.chipActive]}
                                onPress={() => setActivityLevel(a.key)}
                            >
                                <Text style={[styles.chipText, activityLevel === a.key && styles.chipTextActive]}>
                                    {a.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {formPreview && (
                        <View style={styles.previewCard}>
                            <View style={styles.previewHeader}>
                                <Text style={styles.previewTitle}>Your daily target</Text>
                                <Text style={styles.previewBmi}>
                                    BMI {formPreview.bmi} · {formPreview.bmiCategory}
                                </Text>
                            </View>
                            <View style={styles.previewRow}>
                                <View style={styles.previewStat}>
                                    <Text style={styles.previewValue}>{formPreview.calorieGoal}</Text>
                                    <Text style={styles.previewLabel}>calories</Text>
                                </View>
                                <View style={styles.previewStat}>
                                    <Text style={[styles.previewValue, { color: theme.colors.lunch }]}>{formPreview.protein}g</Text>
                                    <Text style={styles.previewLabel}>protein</Text>
                                </View>
                                <View style={styles.previewStat}>
                                    <Text style={[styles.previewValue, { color: theme.colors.amber }]}>{formPreview.carbs}g</Text>
                                    <Text style={styles.previewLabel}>carbs</Text>
                                </View>
                                <View style={styles.previewStat}>
                                    <Text style={[styles.previewValue, { color: theme.colors.error }]}>{formPreview.fat}g</Text>
                                    <Text style={styles.previewLabel}>fat</Text>
                                </View>
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={[globalStyles.button, styles.saveButton, (!name.trim() || !age || !heightCm || !weightKg || saving) && styles.buttonDisabled]}
                        onPress={handleSaveProfile}
                        disabled={!name.trim() || !age || !heightCm || !weightKg || saving}
                    >
                        {saving ? (
                            <ActivityIndicator color={theme.colors.white} />
                        ) : (
                            <Text style={globalStyles.buttonText}>Start Tracking</Text>
                        )}
                    </TouchableOpacity>
                </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        );
    }

    // ---------- Dashboard ----------
    const remainingProtein = Math.max(suggestions.protein - sumMacro(meals, 'protein'), 0);
    const remainingCarbs = Math.max(suggestions.carbs - sumMacro(meals, 'carbs'), 0);
    const remainingFat = Math.max(suggestions.fat - sumMacro(meals, 'fat'), 0);

    const getLast7Days = () => {
        const days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            days.push(date);
        }
        return days;
    };

    const formatDayLabel = (date) => {
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (date.toDateString() === today.toDateString()) return 'Today';
        if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
        return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const formatDateHeader = (date) => {
        const today = new Date();
        if (date.toDateString() === today.toDateString()) return 'Today';
        return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    };

    const mealsByType = {
        breakfast: meals.filter((m) => m.mealType === 'breakfast'),
        lunch: meals.filter((m) => m.mealType === 'lunch'),
        dinner: meals.filter((m) => m.mealType === 'dinner'),
        snack: meals.filter((m) => m.mealType === 'snack'),
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadDashboardData(selectedDate);
        setRefreshing(false);
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.colors.primary} />
                }
            >
                {/* Date selector */}
                <View style={styles.dateSection}>
                    <Text style={styles.headerTitle}>{formatDateHeader(selectedDate)}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScrollerContent}>
                        {getLast7Days().map((date, index) => {
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            return (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.dateButton, isSelected && styles.dateButtonSelected]}
                                    onPress={() => setSelectedDate(date)}
                                >
                                    <Text style={[styles.dateDayName, isSelected && styles.dateDayNameSelected]}>
                                        {formatDayLabel(date)}
                                    </Text>
                                    <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                                        {date.getDate()}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* Calorie ring */}
                <View style={styles.progressSection}>
                    <CircularProgress current={totalCalories} goal={suggestions.calorieGoal} size={200} strokeWidth={16} />
                </View>

                {/* BMI-based macro suggestions */}
                <View style={styles.card}>
                    <View style={styles.suggestionHeader}>
                        <Text style={styles.cardTitle}>Daily targets</Text>
                        <View style={styles.bmiBadge}>
                            <Text style={styles.bmiBadgeText}>BMI {suggestions.bmi} · {suggestions.bmiCategory}</Text>
                        </View>
                    </View>
                    <Text style={styles.suggestionNote}>
                        Based on your profile — aim for {suggestions.protein}g protein ({suggestions.proteinPerKg}g/kg)
                        and {remainingProtein > 0 ? `${remainingProtein}g left today` : 'protein goal reached 🎉'}
                    </Text>

                    <MacroBar label="Protein" current={sumMacro(meals, 'protein')} goal={suggestions.protein} color={theme.colors.lunch} />
                    <MacroBar label="Carbs" current={sumMacro(meals, 'carbs')} goal={suggestions.carbs} color={theme.colors.amber} />
                    <MacroBar label="Fat" current={sumMacro(meals, 'fat')} goal={suggestions.fat} color={theme.colors.error} />

                    <View style={styles.remainingRow}>
                        <Text style={styles.remainingText}>Left today:</Text>
                        <Text style={styles.remainingValue}>{Math.max(suggestions.calorieGoal - totalCalories, 0)} cal</Text>
                        <Text style={styles.remainingDot}>·</Text>
                        <Text style={styles.remainingValue}>{remainingProtein}g protein</Text>
                        <Text style={styles.remainingDot}>·</Text>
                        <Text style={styles.remainingValue}>{remainingCarbs}g carbs</Text>
                    </View>
                </View>

                {/* Log meal CTA */}
                <TouchableOpacity
                    style={styles.logButton}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('AddMeal')}
                >
                    <CameraIcon size={20} color={theme.colors.white} strokeWidth={2} />
                    <Text style={styles.logButtonText}>Log a meal</Text>
                </TouchableOpacity>

                {/* Meal sections */}
                <View style={styles.mealsContainer}>
                    {MEAL_SECTIONS.map(({ key, label }) => {
                        const TypeIcon = MEAL_TYPE_ICONS[key];
                        const typeMeals = mealsByType[key];
                        const sectionTotal = typeMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
                        return (
                            <View key={key} style={styles.mealSection}>
                                <View style={styles.mealSectionHeader}>
                                    <View style={[styles.mealIconWrap, { backgroundColor: `${getMealTypeColor(key)}14` }]}>
                                        <TypeIcon size={16} color={getMealTypeColor(key)} strokeWidth={2} />
                                    </View>
                                    <Text style={styles.mealSectionTitle}>{label}</Text>
                                    {sectionTotal > 0 && (
                                        <Text style={styles.mealSectionCalories}>{sectionTotal} cal</Text>
                                    )}
                                    <TouchableOpacity
                                        style={[styles.addMealChip, { backgroundColor: `${getMealTypeColor(key)}14` }]}
                                        onPress={() => navigation.navigate('AddMeal', { mealType: key })}
                                    >
                                        <Text style={[styles.addMealChipText, { color: getMealTypeColor(key) }]}>+ Add</Text>
                                    </TouchableOpacity>
                                </View>
                                {typeMeals.map((meal) => (
                                    <MealCard key={meal.id} meal={meal} onDelete={() => loadDashboardData(selectedDate)} />
                                ))}
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const sumMacro = (meals, macro) =>
    meals.reduce((sum, meal) => sum + (meal[macro] || 0), 0);

const MacroBar = ({ label, current, goal, color }) => {
    const pct = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
    return (
        <View style={styles.macroBarRow}>
            <Text style={styles.macroBarLabel}>{label}</Text>
            <View style={styles.macroBarTrack}>
                <View style={[styles.macroBarFill, { width: `${pct}%`, backgroundColor: color }]} />
            </View>
            <Text style={styles.macroBarValue}>{Math.round(current)}/{goal}g</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    flex1: { flex: 1 },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        paddingBottom: theme.spacing.xl,
    },
    formContent: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },

    // Setup form
    formTitle: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    formSubtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.sm,
        marginBottom: theme.spacing.xl,
        lineHeight: 22,
    },
    fieldLabel: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    input: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
        fontSize: theme.fontSize.lg,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    chipRow: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
    },
    chipRowWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.md,
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
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    chipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    chipText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
    },
    chipTextActive: {
        color: theme.colors.white,
    },
    previewCard: {
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginTop: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    previewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    previewTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    previewBmi: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
    previewRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    previewStat: {
        alignItems: 'center',
        flex: 1,
    },
    previewValue: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    previewLabel: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    saveButton: {
        marginTop: theme.spacing.sm,
    },
    buttonDisabled: {
        opacity: 0.5,
    },

    // Dashboard
    dateSection: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
    },
    headerTitle: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    dateScrollerContent: {
        gap: theme.spacing.sm,
        paddingRight: theme.spacing.lg,
    },
    dateButton: {
        alignItems: 'center',
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundSecondary,
        minWidth: 62,
    },
    dateButtonSelected: {
        backgroundColor: theme.colors.primary,
    },
    dateDayName: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    dateDayNameSelected: {
        color: theme.colors.white,
    },
    dateNumber: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    dateNumberSelected: {
        color: theme.colors.white,
    },
    progressSection: {
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
    },

    card: {
        backgroundColor: theme.colors.backgroundSecondary,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
    },
    suggestionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    cardTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    bmiBadge: {
        backgroundColor: theme.colors.primarySoft,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: 4,
        borderRadius: theme.borderRadius.full,
    },
    bmiBadgeText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
    suggestionNote: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        lineHeight: 19,
        marginBottom: theme.spacing.md,
    },
    macroBarRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm + 2,
    },
    macroBarLabel: {
        width: 60,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    macroBarTrack: {
        flex: 1,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.backgroundTertiary,
        overflow: 'hidden',
    },
    macroBarFill: {
        height: '100%',
        borderRadius: 4,
    },
    macroBarValue: {
        width: 64,
        textAlign: 'right',
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    remainingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: theme.spacing.sm,
        paddingTop: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderLight,
    },
    remainingText: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textTertiary,
    },
    remainingValue: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
    remainingDot: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textTertiary,
    },

    logButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        gap: theme.spacing.sm,
        ...theme.shadows.md,
    },
    logButtonText: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.white,
    },

    mealsContainer: {
        paddingHorizontal: theme.spacing.lg,
    },
    mealSection: {
        marginBottom: theme.spacing.md,
    },
    mealSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    mealIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.sm,
    },
    mealSectionTitle: {
        flex: 1,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    mealSectionCalories: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
        marginRight: theme.spacing.sm,
    },
    addMealChip: {
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
    },
    addMealChipText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.bold,
    },
});
