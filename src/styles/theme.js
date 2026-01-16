export const theme = {
    colors: {
        primary: '#6366F1', // Indigo
        primaryDark: '#4F46E5',
        primaryLight: '#818CF8',

        secondary: '#10B981', // Emerald
        secondaryDark: '#059669',
        secondaryLight: '#34D399',

        background: '#FFFFFF',
        backgroundSecondary: '#F9FAFB',
        backgroundTertiary: '#F3F4F6',

        text: '#111827',
        textSecondary: '#6B7280',
        textLight: '#9CA3AF',

        border: '#E5E7EB',
        borderLight: '#F3F4F6',

        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',

        // Meal type colors
        breakfast: '#F59E0B', // Amber
        lunch: '#3B82F6', // Blue
        dinner: '#8B5CF6', // Purple
        snack: '#EC4899', // Pink

        white: '#FFFFFF',
        black: '#000000',
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
        xl: 24,
        full: 9999,
    },

    fontSize: {
        xs: 12,
        sm: 14,
        md: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
    },

    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
    },

    shadows: {
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 2,
            elevation: 1,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 5,
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
