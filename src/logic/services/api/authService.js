import { supabase } from './supabase';

/**
 * Sign up with email and password
 * Note: Supabase client uses parameterized queries internally, preventing SQL injection
 */
export const signUpWithEmail = async (email, password) => {
    try {
        // Validate inputs
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const { data, error } = await supabase.auth.signUp({
            email: email.toLowerCase().trim(),
            password,
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
    }
};

/**
 * Sign in with email and password
 */
export const signInWithEmail = async (email, password) => {
    try {
        // Validate inputs
        if (!email || !password) {
            throw new Error('Email and password are required');
        }

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.toLowerCase().trim(),
            password,
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
    }
};

/**
 * Send password reset email
 * Uses Supabase's built-in password reset (free, no SMTP config needed for basic use)
 */
export const sendPasswordResetEmail = async (email) => {
    try {
        if (!email) {
            throw new Error('Email is required');
        }

        const { data, error } = await supabase.auth.resetPasswordForEmail(
            email.toLowerCase().trim(),
            {
                // Optional: redirect URL after password reset
                // redirectTo: 'yourapp://reset-password',
            }
        );

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Password reset error:', error);
        return { data: null, error };
    }
};

/**
 * Get email by phone number (for "forgot email" feature)
 * Uses a parameterized RPC call - SQL injection safe
 */
export const getEmailByPhone = async (phoneNumber) => {
    try {
        if (!phoneNumber) {
            throw new Error('Phone number is required');
        }

        // Clean the phone number (remove spaces, keep only digits and +)
        const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');

        // Use Supabase RPC which uses parameterized queries internally
        const { data, error } = await supabase
            .rpc('get_email_by_phone', { phone: cleanPhone });

        if (error) throw error;

        if (data && data.length > 0) {
            return { email: data[0].email, error: null };
        }

        return { email: null, error: null };
    } catch (error) {
        console.error('Get email by phone error:', error);
        return { email: null, error };
    }
};

/**
 * Update phone number in user profile
 * Uses Supabase client which is SQL injection safe
 */
export const updatePhoneNumber = async (userId, phoneNumber) => {
    try {
        if (!userId || !phoneNumber) {
            throw new Error('User ID and phone number are required');
        }

        // Clean the phone number
        const cleanPhone = phoneNumber.replace(/[^\d+]/g, '');

        const { data, error } = await supabase
            .from('profiles')
            .update({
                phone_number: cleanPhone,
                updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Update phone number error:', error);
        return { data: null, error };
    }
};

/**
 * Sign out
 */
export const signOut = async () => {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        return { error: null };
    } catch (error) {
        console.error('Sign out error:', error);
        return { error };
    }
};

/**
 * Get current session
 */
export const getSession = async () => {
    try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return { session, error: null };
    } catch (error) {
        console.error('Get session error:', error);
        return { session: null, error };
    }
};

/**
 * Get current user
 */
export const getCurrentUser = async () => {
    try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return { user, error: null };
    } catch (error) {
        console.error('Get user error:', error);
        return { user: null, error };
    }
};
