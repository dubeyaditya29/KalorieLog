import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },

    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    // Text styles - Updated for dark theme
    title: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        letterSpacing: -0.5,
    },

    heading: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        letterSpacing: -0.3,
    },

    subheading: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.text,
    },

    body: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.regular,
        color: theme.colors.text,
    },

    caption: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.regular,
        color: theme.colors.textSecondary,
    },

    small: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.regular,
        color: theme.colors.textTertiary,
    },

    // Card styles - Dark theme cards
    card: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.md,
    },

    cardSmall: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        ...theme.shadows.sm,
    },

    cardLarge: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        ...theme.shadows.lg,
    },

    // Button styles - Updated for dark theme
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },

    buttonText: {
        color: theme.colors.white,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
    },

    buttonSecondary: {
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 48,
    },

    buttonSecondaryText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
    },

    buttonOutline: {
        backgroundColor: 'transparent',
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
        minHeight: 48,
    },

    buttonOutlineText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
    },

    // Input styles - Dark theme inputs
    input: {
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
        minHeight: 48,
    },

    // Divider
    divider: {
        height: 1,
        backgroundColor: theme.colors.divider,
    },

    // Spacing utilities
    mb1: { marginBottom: theme.spacing.xs },
    mb2: { marginBottom: theme.spacing.sm },
    mb3: { marginBottom: theme.spacing.md },
    mb4: { marginBottom: theme.spacing.lg },
    mb5: { marginBottom: theme.spacing.xl },

    mt1: { marginTop: theme.spacing.xs },
    mt2: { marginTop: theme.spacing.sm },
    mt3: { marginTop: theme.spacing.md },
    mt4: { marginTop: theme.spacing.lg },
    mt5: { marginTop: theme.spacing.xl },

    mx1: { marginHorizontal: theme.spacing.xs },
    mx2: { marginHorizontal: theme.spacing.sm },
    mx3: { marginHorizontal: theme.spacing.md },
    mx4: { marginHorizontal: theme.spacing.lg },
    mx5: { marginHorizontal: theme.spacing.xl },

    my1: { marginVertical: theme.spacing.xs },
    my2: { marginVertical: theme.spacing.sm },
    my3: { marginVertical: theme.spacing.md },
    my4: { marginVertical: theme.spacing.lg },
    my5: { marginVertical: theme.spacing.xl },

    p1: { padding: theme.spacing.xs },
    p2: { padding: theme.spacing.sm },
    p3: { padding: theme.spacing.md },
    p4: { padding: theme.spacing.lg },
    p5: { padding: theme.spacing.xl },

    px1: { paddingHorizontal: theme.spacing.xs },
    px2: { paddingHorizontal: theme.spacing.sm },
    px3: { paddingHorizontal: theme.spacing.md },
    px4: { paddingHorizontal: theme.spacing.lg },
    px5: { paddingHorizontal: theme.spacing.xl },

    py1: { paddingVertical: theme.spacing.xs },
    py2: { paddingVertical: theme.spacing.sm },
    py3: { paddingVertical: theme.spacing.md },
    py4: { paddingVertical: theme.spacing.lg },
    py5: { paddingVertical: theme.spacing.xl },
});
