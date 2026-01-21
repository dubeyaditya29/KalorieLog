export const theme = {
    colors: {
        // Backgrounds - Dark theme
        background: '#1C1C1E',        // Main dark background
        backgroundSecondary: '#2C2C2E', // Card backgrounds
        backgroundTertiary: '#3A3A3C',  // Elevated elements

        // Text - High contrast for dark backgrounds
        text: '#FFFFFF',              // Primary text
        textSecondary: '#ABABAB',     // Secondary text
        textTertiary: '#6E6E73',      // Tertiary/disabled text
        textLight: '#8E8E93',         // Even lighter text

        // Accents - iOS-style colors
        primary: '#0A84FF',           // Blue accent
        primaryDark: '#0066CC',
        primaryLight: '#409CFF',

        secondary: '#30D158',         // Green
        secondaryDark: '#248A3D',
        secondaryLight: '#5DE283',

        // Status colors
        success: '#30D158',           // Green
        warning: '#FFD60A',           // Yellow
        error: '#FF453A',             // Red
        info: '#0A84FF',              // Blue

        // Meal type colors - Muted for dark theme
        breakfast: '#5E5CE6',         // Indigo/Purple (was Yellow)
        lunch: '#0A84FF',             // Blue
        dinner: '#BF5AF2',            // Purple
        snack: '#FF6B6B',             // Coral Pink (was Orange)

        // Borders & Dividers
        border: '#38383A',
        borderLight: '#48484A',
        divider: '#48484A',

        // Special
        white: '#FFFFFF',
        black: '#000000',
        overlay: 'rgba(0, 0, 0, 0.5)',
    },

    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 48,
    },

    borderRadius: {
        sm: 8,
        md: 12,
        lg: 16,
        xl: 20,
        full: 9999,
    },

    fontSize: {
        xs: 11,
        sm: 13,
        md: 15,
        lg: 17,
        xl: 20,
        xxl: 24,
        xxxl: 34,
        huge: 48,
    },

    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        heavy: '800',
    },

    shadows: {
        none: {
            shadowColor: 'transparent',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
            elevation: 0,
        },
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.18,
            shadowRadius: 1.5,
            elevation: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.22,
            shadowRadius: 3,
            elevation: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.28,
            shadowRadius: 5,
            elevation: 8,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.32,
            shadowRadius: 10,
            elevation: 12,
        },
    },
};

export const getMealTypeColor = (mealType) => {
    const colors = {
        breakfast: theme.colors.breakfast,
        lunch: theme.colors.lunch,
        dinner: theme.colors.dinner,
        snack: theme.colors.snack,
    };
    return colors[mealType] || theme.colors.primary;
};

export const getMealTypeIcon = (mealType) => {
    const icons = {
        breakfast: '🌅',
        lunch: '☀️',
        dinner: '🌙',
        snack: '🍎',
    };
    return icons[mealType] || '🍽️';
};

// Helper function to get lighter version of color for gradients
export const getLighterColor = (color, opacity = 0.3) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Helper to create gradient colors
export const getGradientColors = (startColor, endColor) => {
    return [startColor, endColor];
};
