import { supabase } from './supabase';

/**
 * Sign up with email and send verification code
 */
export const signUpWithEmail = async (email, password) => {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: undefined, // We'll handle verification in-app
            },
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
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
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
 * Verify email with OTP code
 */
export const verifyEmail = async (email, token) => {
    try {
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'signup',
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Verification error:', error);
        return { data: null, error };
    }
};

/**
 * Resend verification code
 */
export const resendVerificationCode = async (email) => {
    try {
        const { data, error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Resend error:', error);
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
