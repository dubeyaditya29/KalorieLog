import React from 'react';
import { View, Text } from 'react-native';
import { useThemedStyles } from '../../styles/useThemedStyles';

/**
 * Grouped settings card with an optional uppercase section title.
 */
export const SectionCard = ({ title, children }) => {
    const { styles } = useThemedStyles(createStyles);
    return (
        <View style={styles.wrapper}>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            <View style={styles.card}>{children}</View>
        </View>
    );
};

const createStyles = (theme) => ({
    wrapper: {
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
        marginBottom: theme.spacing.sm,
        marginLeft: theme.spacing.xs,
    },
    card: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        ...theme.shadows.sm,
    },
});
