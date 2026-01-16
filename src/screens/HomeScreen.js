import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    RefreshControl,
    SafeAreaView,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { CalorieCounter } from '../components/CalorieCounter';
import { MealCard } from '../components/MealCard';
import { theme } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import {
    getTodaysMeals,
    getTotalCaloriesByDate,
    getCaloriesByMealType,
    deleteMeal,
} from '../services/storageService';

export const HomeScreen = ({ navigation }) => {
    const [meals, setMeals] = useState([]);
    const [totalCalories, setTotalCalories] = useState(0);
    const [breakdown, setBreakdown] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const loadData = async () => {
        try {
            const todaysMeals = await getTodaysMeals();
            const total = await getTotalCaloriesByDate(new Date());
            const mealBreakdown = await getCaloriesByMealType(new Date());

            setMeals(todaysMeals.sort((a, b) => b.timestamp - a.timestamp));
            setTotalCalories(total);
            setBreakdown(mealBreakdown);
        } catch (error) {
            console.error('Error loading data:', error);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await loadData();
        setRefreshing(false);
    };

    const handleDeleteMeal = async (mealId) => {
        try {
            await deleteMeal(mealId);
            await loadData();
        } catch (error) {
            console.error('Error deleting meal:', error);
        }
    };

    // Load data when screen comes into focus
    useFocusEffect(
        useCallback(() => {
            loadData();
        }, [])
    );

    const formatDate = () => {
        const today = new Date();
        return today.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.contentContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.appName}>BiteLog</Text>
                        <Text style={styles.date}>{formatDate()}</Text>
                    </View>
                </View>

                {/* Calorie Counter */}
                <View style={styles.section}>
                    <CalorieCounter
                        totalCalories={totalCalories}
                        goalCalories={2000}
                        breakdown={breakdown}
                    />
                </View>

                {/* Quick Add Buttons */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Add Meal</Text>
                    <View style={styles.quickAddButtons}>
                        <TouchableOpacity
                            style={[styles.quickAddButton, { backgroundColor: theme.colors.breakfast + '20' }]}
                            onPress={() => navigation.navigate('AddMeal', { mealType: 'breakfast' })}
                        >
                            <Text style={styles.quickAddIcon}>🌅</Text>
                            <Text style={[styles.quickAddText, { color: theme.colors.breakfast }]}>
                                Breakfast
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.quickAddButton, { backgroundColor: theme.colors.lunch + '20' }]}
                            onPress={() => navigation.navigate('AddMeal', { mealType: 'lunch' })}
                        >
                            <Text style={styles.quickAddIcon}>☀️</Text>
                            <Text style={[styles.quickAddText, { color: theme.colors.lunch }]}>
                                Lunch
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.quickAddButton, { backgroundColor: theme.colors.dinner + '20' }]}
                            onPress={() => navigation.navigate('AddMeal', { mealType: 'dinner' })}
                        >
                            <Text style={styles.quickAddIcon}>🌙</Text>
                            <Text style={[styles.quickAddText, { color: theme.colors.dinner }]}>
                                Dinner
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.quickAddButton, { backgroundColor: theme.colors.snack + '20' }]}
                            onPress={() => navigation.navigate('AddMeal', { mealType: 'snack' })}
                        >
                            <Text style={styles.quickAddIcon}>🍎</Text>
                            <Text style={[styles.quickAddText, { color: theme.colors.snack }]}>
                                Snack
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Today's Meals */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Meals</Text>
                        {meals.length > 0 && (
                            <Text style={styles.mealCount}>{meals.length} meal{meals.length !== 1 ? 's' : ''}</Text>
                        )}
                    </View>

                    {meals.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateIcon}>🍽️</Text>
                            <Text style={styles.emptyStateText}>No meals logged yet</Text>
                            <Text style={styles.emptyStateSubtext}>
                                Tap a meal type above to get started
                            </Text>
                        </View>
                    ) : (
                        meals.map((meal) => (
                            <MealCard
                                key={meal.id}
                                meal={meal}
                                onDelete={handleDeleteMeal}
                            />
                        ))
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    contentContainer: {
        padding: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    appName: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    date: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    section: {
        marginBottom: theme.spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    mealCount: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    quickAddButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    quickAddButton: {
        flex: 1,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 80,
    },
    quickAddIcon: {
        fontSize: 32,
        marginBottom: theme.spacing.xs,
    },
    quickAddText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
    },
    emptyState: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    emptyStateIcon: {
        fontSize: 64,
        marginBottom: theme.spacing.md,
    },
    emptyStateText: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    emptyStateSubtext: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
});
