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

    // Text styles
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },

    heading: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
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

    // Card styles
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        ...theme.shadows.md,
    },

    cardSmall: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.sm,
        ...theme.shadows.sm,
    },

    // Button styles
    button: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        justifyContent: 'center',
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
    },

    buttonSecondaryText: {
        color: theme.colors.text,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
    },

    // Input styles
    input: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },

    // Spacing utilities
    mb1: { marginBottom: theme.spacing.xs },
    mb2: { marginBottom: theme.spacing.sm },
    mb3: { marginBottom: theme.spacing.md },
    mb4: { marginBottom: theme.spacing.lg },

    mt1: { marginTop: theme.spacing.xs },
    mt2: { marginTop: theme.spacing.sm },
    mt3: { marginTop: theme.spacing.md },
    mt4: { marginTop: theme.spacing.lg },

    mx1: { marginHorizontal: theme.spacing.xs },
    mx2: { marginHorizontal: theme.spacing.sm },
    mx3: { marginHorizontal: theme.spacing.md },
    mx4: { marginHorizontal: theme.spacing.lg },

    my1: { marginVertical: theme.spacing.xs },
    my2: { marginVertical: theme.spacing.sm },
    my3: { marginVertical: theme.spacing.md },
    my4: { marginVertical: theme.spacing.lg },

    p1: { padding: theme.spacing.xs },
    p2: { padding: theme.spacing.sm },
    p3: { padding: theme.spacing.md },
    p4: { padding: theme.spacing.lg },
});
