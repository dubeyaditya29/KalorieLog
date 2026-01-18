import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './api/supabase';
import {
    saveMealToCloud,
    getTodaysMealsFromCloud,
    getTotalCaloriesByDateFromCloud,
    deleteMealFromCloud,
    getUserMeals
} from './api/mealService';

const STORAGE_KEY = '@biteLog_meals';

/**
 * Get current user ID from Supabase
 */
const getUserId = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id;
};

/**
 * Save a new meal entry (to Supabase)
 */
export const saveMeal = async (mealData) => {
    try {
        const userId = await getUserId();

        if (!userId) {
            throw new Error('User not authenticated');
        }

        console.log('Saving meal to Supabase...', mealData);

        const { data, error } = await saveMealToCloud(userId, mealData);

        if (error) {
            console.error('Supabase save error:', error);
            throw error;
        }

        console.log('Meal saved successfully:', data);
        return data;
    } catch (error) {
        console.error('Error saving meal:', error);
        throw new Error('Failed to save meal');
    }
};

/**
 * Get all meals (from Supabase)
 */
export const getAllMeals = async () => {
    try {
        const userId = await getUserId();

        if (!userId) {
            return [];
        }

        const { data, error } = await getUserMeals(userId);

        if (error) {
            console.error('Error getting meals:', error);
            return [];
        }

        // Convert Supabase format to app format
        return data.map(meal => ({
            id: meal.id,
            timestamp: new Date(meal.logged_at).getTime(),
            mealType: meal.meal_type,
            calories: meal.calories,
            description: meal.description,
            items: meal.items || [],
            protein: meal.protein_g,
            carbs: meal.carbs_g,
            fat: meal.fat_g,
        }));
    } catch (error) {
        console.error('Error getting meals:', error);
        return [];
    }
};

/**
 * Get today's meals (from Supabase)
 */
export const getTodaysMeals = async () => {
    try {
        const userId = await getUserId();

        if (!userId) {
            return [];
        }

        const { data, error } = await getTodaysMealsFromCloud(userId);

        if (error) {
            console.error('Error getting today meals:', error);
            return [];
        }

        // Convert Supabase format to app format
        return data.map(meal => ({
            id: meal.id,
            timestamp: new Date(meal.logged_at).getTime(),
            mealType: meal.meal_type,
            calories: meal.calories,
            description: meal.description,
            items: meal.items || [],
            protein: meal.protein_g,
            carbs: meal.carbs_g,
            fat: meal.fat_g,
        }));
    } catch (error) {
        console.error('Error getting today meals:', error);
        return [];
    }
};

/**
 * Calculate total calories for a specific date (from Supabase)
 */
export const getTotalCaloriesByDate = async (date) => {
    try {
        const userId = await getUserId();

        if (!userId) {
            return 0;
        }

        const { data, error } = await getTotalCaloriesByDateFromCloud(userId, date);

        if (error) {
            console.error('Error getting total calories:', error);
            return 0;
        }

        return data || 0;
    } catch (error) {
        console.error('Error getting total calories:', error);
        return 0;
    }
};

/**
 * Delete a meal by ID (from Supabase)
 */
export const deleteMeal = async (mealId) => {
    try {
        console.log('Deleting meal:', mealId);

        const { error } = await deleteMealFromCloud(mealId);

        if (error) {
            console.error('Error deleting meal:', error);
            throw error;
        }

        console.log('Meal deleted successfully');
        return true;
    } catch (error) {
        console.error('Error deleting meal:', error);
        throw new Error('Failed to delete meal');
    }
};

/**
 * Get meals by date (from Supabase)
 */
export const getMealsByDate = async (date) => {
    const allMeals = await getAllMeals();
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return allMeals.filter(
        (meal) =>
            meal.timestamp >= startOfDay.getTime() &&
            meal.timestamp <= endOfDay.getTime()
    );
};

/**
 * Get calories by meal type for a specific date
 */
export const getCaloriesByMealType = async (date) => {
    const meals = await getMealsByDate(date);
    const breakdown = {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snack: 0,
    };

    meals.forEach((meal) => {
        if (breakdown.hasOwnProperty(meal.mealType)) {
            breakdown[meal.mealType] += meal.calories || 0;
        }
    });

    return breakdown;
};

/**
 * Clear all meals (for testing/debugging)
 */
export const clearAllMeals = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
        return true;
    } catch (error) {
        console.error('Error clearing meals:', error);
        throw new Error('Failed to clear meals');
    }
};

/**
 * Get weekly calorie summary (last 7 days)
 */
export const getWeeklySummary = async () => {
    try {
        const meals = await getAllMeals();
        const today = new Date();
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

        const weeklyMeals = meals.filter(
            (meal) => meal.timestamp >= weekAgo.getTime()
        );

        const dailyTotals = {};
        weeklyMeals.forEach((meal) => {
            const date = new Date(meal.timestamp).toDateString();
            dailyTotals[date] = (dailyTotals[date] || 0) + (meal.calories || 0);
        });

        return dailyTotals;
    } catch (error) {
        console.error('Error getting weekly summary:', error);
        return {};
    }
};
