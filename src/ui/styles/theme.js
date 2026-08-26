export const theme = {
    colors: {
        // Backgrounds - Clean light theme
        background: '#FFFFFF',          // Main background
        backgroundSecondary: '#F5F7FA', // Card backgrounds
        backgroundTertiary: '#EBEFF5',  // Elevated elements / inputs

        // Text - Dark slate on white
        text: '#0F172A',              // Primary text
        textSecondary: '#5A6577',     // Secondary text
        textTertiary: '#8B95A5',      // Tertiary/disabled text
        textLight: '#B0B8C4',         // Even lighter text

        // Accents - Blue family
        primary: '#007AFF',           // Blue accent
        primaryDark: '#005ECB',
        primaryLight: '#66AFFF',
        primarySoft: '#EAF3FF',       // Tinted blue background

        secondary: '#34C759',         // Green
        secondaryDark: '#248A3D',
        secondaryLight: '#7CE495',

        // Status colors
        success: '#34C759',           // Green
        warning: '#FF9500',           // Orange
        error: '#FF3B30',             // Red
        info: '#007AFF',              // Blue
        amber: '#F59E0B',             // Carbs accent

        // Meal type colors - Vibrant on white
        breakfast: '#6366F1',         // Indigo
        lunch: '#007AFF',             // Blue
        dinner: '#8B5CF6',            // Purple
        snack: '#FF6B6B',             // Coral Pink

        // Borders & Dividers
        border: '#E3E8EF',
        borderLight: '#EDF1F6',
        divider: '#E3E8EF',

        // Special
        white: '#FFFFFF',
        black: '#000000',
        overlay: 'rgba(15, 23, 42, 0.45)',
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
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.06,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
        },
        lg: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.10,
            shadowRadius: 8,
            elevation: 4,
        },
        xl: {
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.12,
            shadowRadius: 14,
            elevation: 8,
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

// Helper function to get lighter version of color for gradients
export const getLighterColor = (color, opacity = 0.3) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

// Helper to create gradient colors
export const getGradientColors = (startColor, endColor) => {
    return [startColor, endColor];
};
