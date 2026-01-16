import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@biteLog_meals';

/**
 * Meal entry structure:
 * {
 *   id: string,
 *   timestamp: number,
 *   mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
 *   calories: number,
 *   description: string,
 *   items: string[]
 * }
 */

/**
 * Save a new meal entry
 */
export const saveMeal = async (mealData) => {
    try {
        const meals = await getAllMeals();
        const newMeal = {
            id: Date.now().toString(),
            timestamp: Date.now(),
            ...mealData,
        };
        meals.push(newMeal);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(meals));
        return newMeal;
    } catch (error) {
        console.error('Error saving meal:', error);
        throw new Error('Failed to save meal');
    }
};

/**
 * Get all meals
 */
export const getAllMeals = async () => {
    try {
        const mealsJson = await AsyncStorage.getItem(STORAGE_KEY);
        return mealsJson ? JSON.parse(mealsJson) : [];
    } catch (error) {
        console.error('Error getting meals:', error);
        return [];
    }
};

/**
 * Get meals for a specific date
 */
export const getMealsByDate = async (date) => {
    try {
        const meals = await getAllMeals();
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return meals.filter(
            (meal) =>
                meal.timestamp >= startOfDay.getTime() &&
                meal.timestamp <= endOfDay.getTime()
        );
    } catch (error) {
        console.error('Error getting meals by date:', error);
        return [];
    }
};

/**
 * Get today's meals
 */
export const getTodaysMeals = async () => {
    return getMealsByDate(new Date());
};

/**
 * Calculate total calories for a specific date
 */
export const getTotalCaloriesByDate = async (date) => {
    const meals = await getMealsByDate(date);
    return meals.reduce((total, meal) => total + (meal.calories || 0), 0);
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
 * Delete a meal by ID
 */
export const deleteMeal = async (mealId) => {
    try {
        const meals = await getAllMeals();
        const filteredMeals = meals.filter((meal) => meal.id !== mealId);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filteredMeals));
        return true;
    } catch (error) {
        console.error('Error deleting meal:', error);
        throw new Error('Failed to delete meal');
    }
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
