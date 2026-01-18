import { supabase } from './supabase';

/**
 * Get user profile
 */
export const getProfile = async (userId) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Get profile error:', error);
        return { data: null, error };
    }
};

/**
 * Create or update user profile
 */
export const upsertProfile = async (userId, profileData) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .upsert({
                id: userId,
                ...profileData,
                updated_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Upsert profile error:', error);
        return { data: null, error };
    }
};

/**
 * Update profile
 */
export const updateProfile = async (userId, updates) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({
                ...updates,
                updated_at: new Date().toISOString(),
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Update profile error:', error);
        return { data: null, error };
    }
};

/**
 * Check if user has completed profile
 */
export const hasCompletedProfile = async (userId) => {
    try {
        const { data, error } = await getProfile(userId);

        if (error || !data) return false;

        // Check if required fields are filled
        return !!(data.name && data.age && data.height_cm && data.weight_kg);
    } catch (error) {
        console.error('Check profile error:', error);
        return false;
    }
};
