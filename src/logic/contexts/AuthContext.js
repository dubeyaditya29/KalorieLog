import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { supabase } from '../services/api/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);
    // Counter to trigger profile refresh when updated
    const [profileVersion, setProfileVersion] = useState(0);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                console.log('Auth state changed:', _event);
                setSession(session);
                setUser(session?.user ?? null);
            }
        );

        return () => subscription.unsubscribe();
    }, []);

    // Function to refresh profile check (call after profile update)
    const refreshProfile = useCallback(() => {
        console.log('Refreshing profile...');
        setProfileVersion(v => v + 1);
    }, []);

    const value = {
        user,
        session,
        loading,
        profileVersion,
        refreshProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
