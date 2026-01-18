import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    RefreshControl,
    SafeAreaView,
    ScrollView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { theme, getMealTypeColor } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { getTodaysMeals, getTotalCaloriesByDate } from '../../services/storageService';
import { CircularProgress } from '../../components/common/CircularProgress';
import { MacroRings } from '../../components/home/MacroRings';
import { MealCard } from '../../components/meal/MealCard';
import { useAuth } from '../../contexts/AuthContext';
import { getProfile } from '../../services/api/profileService';


export const HomeScreen = ({ navigation }) => {
    const { user } = useAuth();
    const [meals, setMeals] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [calorieGoal, setCalorieGoal] = useState(2300);
    const [profile, setProfile] = useState(null);

    const loadData = async () => {
        try {
            // Load profile for calorie goal
            const { data: profileData } = await getProfile(user.id);
            if (profileData) {
                setProfile(profileData);
                setCalorieGoal(profileData.calorie_goal || 2300);
            }

            // Load meals
            const todaysMeals = await getTodaysMeals();
            const total = await getTotalCaloriesByDate(new Date());
            setMeals(todaysMeals);
            setTotalCalories(total);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    // Calculate actual macros from meals
    const totalProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
    const totalCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
    const totalFat = meals.reduce((sum, meal) => sum + (meal.fat || 0), 0);

    // Calculate macro goals (30% protein, 40% carbs, 30% fat)
    const proteinGoal = Math.round((calorieGoal * 0.3) / 4);
    const carbsGoal = Math.round((calorieGoal * 0.4) / 4);
    const fatGoal = Math.round((calorieGoal * 0.3) / 9);

    // Group meals by type
    const mealsByType = {
        breakfast: meals.filter(m => m.mealType === 'breakfast'),
        lunch: meals.filter(m => m.mealType === 'lunch'),
        dinner: meals.filter(m => m.mealType === 'dinner'),
        snack: meals.filter(m => m.mealType === 'snack'),
    };

    const renderMealSection = (mealType, mealTypeLabel, icon) => {
        const typeMeals = mealsByType[mealType];
        const totalForType = typeMeals.reduce((sum, meal) => sum + meal.calories, 0);

        return (
            <View key={mealType} style={styles.mealSection}>
                <TouchableOpacity
                    style={styles.mealSectionHeader}
                    onPress={() => navigation.navigate('AddMeal', { mealType })}
                >
                    <View style={styles.mealSectionLeft}>
                        <Text style={styles.mealSectionIcon}>{icon}</Text>
                        <Text style={styles.mealSectionTitle}>{mealTypeLabel}</Text>
                        {totalForType > 0 && (
                            <Text style={styles.mealSectionCalories}>{totalForType} cal</Text>
                        )}
                    </View>
                    <Text style={styles.addButton}>+</Text>
                </TouchableOpacity>

                {typeMeals.length > 0 && (
                    <View style={styles.mealsList}>
                        {typeMeals.map((meal) => (
                            <MealCard
                                key={meal.id}
                                meal={meal}
                                onDelete={loadData}
                            />
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        tintColor={theme.colors.text}
                    />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>TODAY</Text>
                </View>

                {/* Circular Progress */}
                <View style={styles.progressSection}>
                    <CircularProgress
                        current={totalCalories}
                        goal={calorieGoal}
                        size={220}
                        strokeWidth={18}
                    />
                </View>

                {/* Macronutrients - Circular Rings */}
                <View style={styles.macrosCard}>
                    <Text style={styles.macrosTitle}>Macronutrients</Text>
                    <MacroRings
                        protein={Math.round(totalProtein)}
                        carbs={Math.round(totalCarbs)}
                        fat={Math.round(totalFat)}
                        proteinGoal={proteinGoal}
                        carbsGoal={carbsGoal}
                        fatGoal={fatGoal}
                    />
                </View>

                {/* Meal Sections */}
                <View style={styles.mealsContainer}>
                    {renderMealSection('breakfast', 'Breakfast', '🌅')}
                    {renderMealSection('lunch', 'Lunch', '☀️')}
                    {renderMealSection('dinner', 'Dinner', '🌙')}
                    {renderMealSection('snack', 'Snacks', '🍎')}
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
    contentContainer: {
        paddingBottom: theme.spacing.xl,
    },
    header: {
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.sm,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        letterSpacing: 1,
    },
    progressSection: {
        alignItems: 'center',
        paddingVertical: theme.spacing.xl,
    },
    macrosCard: {
        backgroundColor: theme.colors.backgroundSecondary,
        marginHorizontal: theme.spacing.lg,
        marginBottom: theme.spacing.lg,
        padding: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
    },
    macrosTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.md,
    },
    mealsContainer: {
        paddingHorizontal: theme.spacing.lg,
    },
    mealSection: {
        marginBottom: theme.spacing.md,
    },
    mealSectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
    },
    mealSectionLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    mealSectionIcon: {
        fontSize: 20,
        marginRight: theme.spacing.sm,
    },
    mealSectionTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginRight: theme.spacing.sm,
    },
    mealSectionCalories: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    addButton: {
        fontSize: 28,
        fontWeight: theme.fontWeight.regular,
        color: theme.colors.primary,
        lineHeight: 28,
    },
    mealsList: {
        marginTop: theme.spacing.sm,
        gap: theme.spacing.sm,
    },
});
