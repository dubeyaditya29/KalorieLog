import { supabase } from './supabase';

/**
 * Save a meal to Supabase
 */
export const saveMealToCloud = async (userId, mealData) => {
    try {
        const { data, error } = await supabase
            .from('meals')
            .insert({
                user_id: userId,
                meal_type: mealData.mealType,
                calories: mealData.calories,
                description: mealData.description,
                items: mealData.items,
                protein_g: mealData.protein || null,
                carbs_g: mealData.carbs || null,
                fat_g: mealData.fat || null,
                logged_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Save meal error:', error);
        return { data: null, error };
    }
};

/**
 * Get all meals for a user
 */
export const getUserMeals = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('user_id', userId)
            .order('logged_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Get meals error:', error);
        return { data: null, error };
    }
};

/**
 * Get today's meals for a user
 */
export const getTodaysMealsFromCloud = async (userId) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('user_id', userId)
            .gte('logged_at', today.toISOString())
            .order('logged_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Get today meals error:', error);
        return { data: null, error };
    }
};

/**
 * Get total calories for a date
 */
export const getTotalCaloriesByDateFromCloud = async (userId, date) => {
    try {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const { data, error } = await supabase
            .from('meals')
            .select('calories')
            .eq('user_id', userId)
            .gte('logged_at', startOfDay.toISOString())
            .lte('logged_at', endOfDay.toISOString());

        if (error) throw error;

        const total = data.reduce((sum, meal) => sum + (meal.calories || 0), 0);
        return { data: total, error: null };
    } catch (error) {
        console.error('Get total calories error:', error);
        return { data: 0, error };
    }
};

/**
 * Delete a meal
 */
export const deleteMealFromCloud = async (mealId) => {
    try {
        const { error } = await supabase
            .from('meals')
            .delete()
            .eq('id', mealId);

        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Delete meal error:', error);
        return { error };
    }
};

/**
 * Get meals by type for today
 */
export const getMealsByType = async (userId, mealType) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const { data, error } = await supabase
            .from('meals')
            .select('*')
            .eq('user_id', userId)
            .eq('meal_type', mealType)
            .gte('logged_at', today.toISOString())
            .order('logged_at', { ascending: false });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Get meals by type error:', error);
        return { data: null, error };
    }
};
