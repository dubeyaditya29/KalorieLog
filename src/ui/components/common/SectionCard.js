import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

/**
 * Grouped settings card with an optional uppercase section title.
 * Children are rendered inside the card (usually SettingsRow items).
 */
export const SectionCard = ({ title, children }) => (
    <View style={styles.wrapper}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={styles.card}>{children}</View>
    </View>
);

const styles = StyleSheet.create({
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
