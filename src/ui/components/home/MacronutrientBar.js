import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

export const MacronutrientBar = ({ label, current, goal, color }) => {
    const percentage = Math.min((current / goal) * 100, 100);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.values}>
                    {current.toFixed(1)} / {goal.toFixed(1)}
                </Text>
            </View>
            <View style={styles.barBackground}>
                <View
                    style={[
                        styles.barFill,
                        {
                            width: `${percentage}%`,
                            backgroundColor: color
                        }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    values: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    barBackground: {
        height: 6,
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
    },
    barFill: {
        height: '100%',
        borderRadius: theme.borderRadius.full,
    },
});
