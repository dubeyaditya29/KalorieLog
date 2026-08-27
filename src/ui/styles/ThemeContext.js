import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createTheme } from './theme';

const STORAGE_KEY = '@kyra_color_scheme';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [mode, setModeState] = useState('light');
    const [ready, setReady] = useState(false);

    useEffect(() => {
        AsyncStorage.getItem(STORAGE_KEY)
            .then((value) => {
                if (value === 'dark' || value === 'light') {
                    setModeState(value);
                }
            })
            .catch(() => {})
            .finally(() => setReady(true));
    }, []);

    const setMode = useCallback((next) => {
        const resolved = next === 'dark' ? 'dark' : 'light';
        setModeState(resolved);
        AsyncStorage.setItem(STORAGE_KEY, resolved).catch(() => {});
    }, []);

    const toggleTheme = useCallback(() => {
        setMode(mode === 'dark' ? 'light' : 'dark');
    }, [mode, setMode]);

    const theme = useMemo(() => createTheme(mode), [mode]);

    const value = useMemo(
        () => ({
            theme,
            mode,
            isDark: mode === 'dark',
            ready,
            setMode,
            toggleTheme,
        }),
        [theme, mode, ready, setMode, toggleTheme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
