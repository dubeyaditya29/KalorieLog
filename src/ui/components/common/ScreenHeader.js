import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../styles/ThemeContext';
import { KyraLogo } from '../icons';
import { sunIcon, moonIcon } from '../../assets';

export const ThemeToggle = ({ size = 24 }) => {
    const { theme, isDark, toggleTheme } = useTheme();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            accessibilityRole="button"
            accessibilityLabel={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={styles.toggleHit}
        >
            <Image
                source={isDark ? sunIcon : moonIcon}
                style={{ width: size, height: size, tintColor: theme.colors.text }}
            />
        </TouchableOpacity>
    );
};

export const BrandMark = ({ size = 26 }) => {
    const { theme } = useTheme();
    return (
        <View style={styles.brand}>
            <KyraLogo size={size} color={theme.colors.primary} />
        </View>
    );
};

/** Top bar for screens that are not inside the tab navigator header. */
export const ScreenHeader = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    return (
        <View style={[styles.bar, {
            paddingTop: insets.top + 8,
            borderBottomColor: theme.colors.borderLight,
        }]}>
            <View style={styles.barCenter} pointerEvents="none">
                <KyraLogo size={28} color={theme.colors.primary} />
            </View>
            <View style={styles.barRight}>
                <ThemeToggle />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    toggleHit: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    brand: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    bar: {
        minHeight: 52,
        justifyContent: 'center',
        paddingBottom: 8,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    barCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
    },
    barRight: {
        position: 'absolute',
        right: 12,
        bottom: 2,
        justifyContent: 'center',
    },
});
