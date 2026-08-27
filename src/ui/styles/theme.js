const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    full: 9999,
};

const fontSize = {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 34,
    huge: 48,
};

const fontWeight = {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    heavy: '800',
};

export const lightColors = {
    background: '#FFFFFF',
    backgroundSecondary: '#F5F7FA',
    backgroundTertiary: '#EBEFF5',

    text: '#0F172A',
    textSecondary: '#5A6577',
    textTertiary: '#8B95A5',
    textLight: '#B0B8C4',

    primary: '#007AFF',
    primaryDark: '#005ECB',
    primaryLight: '#66AFFF',
    primarySoft: '#EAF3FF',

    secondary: '#34C759',
    secondaryDark: '#248A3D',
    secondaryLight: '#7CE495',

    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    info: '#007AFF',
    amber: '#F59E0B',

    breakfast: '#6366F1',
    lunch: '#007AFF',
    dinner: '#8B5CF6',
    snack: '#FF6B6B',

    border: '#E3E8EF',
    borderLight: '#EDF1F6',
    divider: '#E3E8EF',

    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(15, 23, 42, 0.45)',
};

export const darkColors = {
    background: '#0B0F14',
    backgroundSecondary: '#151B22',
    backgroundTertiary: '#1E2630',

    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    textLight: '#475569',

    primary: '#0A84FF',
    primaryDark: '#409CFF',
    primaryLight: '#64B5FF',
    primarySoft: 'rgba(10, 132, 255, 0.18)',

    secondary: '#30D158',
    secondaryDark: '#248A3D',
    secondaryLight: '#7CE495',

    success: '#30D158',
    warning: '#FF9F0A',
    error: '#FF453A',
    info: '#0A84FF',
    amber: '#F59E0B',

    breakfast: '#818CF8',
    lunch: '#0A84FF',
    dinner: '#A78BFA',
    snack: '#FF7B7B',

    border: '#2A3340',
    borderLight: '#1F2732',
    divider: '#2A3340',

    white: '#FFFFFF',
    black: '#000000',
    overlay: 'rgba(0, 0, 0, 0.65)',
};

const lightShadows = {
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
};

const darkShadows = {
    none: lightShadows.none,
    sm: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.35,
        shadowRadius: 2,
        elevation: 1,
    },
    md: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 2,
    },
    lg: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.45,
        shadowRadius: 8,
        elevation: 4,
    },
    xl: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.5,
        shadowRadius: 14,
        elevation: 8,
    },
};

export const createTheme = (mode = 'light') => ({
    mode,
    colors: mode === 'dark' ? darkColors : lightColors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    shadows: mode === 'dark' ? darkShadows : lightShadows,
});

/** Default light theme — prefer `useTheme()` so colors follow dark/light mode. */
export const theme = createTheme('light');

export const getMealTypeColor = (mealType, colors = lightColors) => {
    const map = {
        breakfast: colors.breakfast,
        lunch: colors.lunch,
        dinner: colors.dinner,
        snack: colors.snack,
    };
    return map[mealType] || colors.primary;
};

export const getLighterColor = (color, opacity = 0.3) => {
    return `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`;
};

export const getGradientColors = (startColor, endColor) => {
    return [startColor, endColor];
};
