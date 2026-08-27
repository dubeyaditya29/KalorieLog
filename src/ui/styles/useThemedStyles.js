import { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import { useTheme } from './ThemeContext';
import { createGlobalStyles } from './globalStyles';

/**
 * Build StyleSheet from the active theme.
 * @param {(theme: object) => object} factory - returns a styles object (not already StyleSheet.create'd)
 */
export const useThemedStyles = (factory) => {
    const ctx = useTheme();
    const styles = useMemo(
        () => StyleSheet.create(factory(ctx.theme)),
        [ctx.theme.mode]
    );
    const globalStyles = useMemo(
        () => createGlobalStyles(ctx.theme),
        [ctx.theme.mode]
    );
    return { ...ctx, styles, globalStyles };
};
