import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../styles/theme';

export const CalorieCounter = ({ totalCalories, goalCalories = 2000, breakdown }) => {
    const percentage = Math.min((totalCalories / goalCalories) * 100, 100);
    const remaining = Math.max(goalCalories - totalCalories, 0);

    const getProgressColor = () => {
        if (percentage < 50) return theme.colors.success;
        if (percentage < 80) return theme.colors.warning;
        return theme.colors.error;
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Today's Calories</Text>
                <Text style={styles.goal}>Goal: {goalCalories} cal</Text>
            </View>

            {/* Circular Progress */}
            <View style={styles.circleContainer}>
                <View style={styles.circle}>
                    <Text style={styles.totalCalories}>{totalCalories}</Text>
                    <Text style={styles.caloriesLabel}>calories</Text>
                    <Text style={styles.remaining}>{remaining} left</Text>
                </View>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressBarContainer}>
                <View
                    style={[
                        styles.progressBar,
                        {
                            width: `${percentage}%`,
                            backgroundColor: getProgressColor()
                        }
                    ]}
                />
            </View>

            {/* Breakdown by meal type */}
            {breakdown && (
                <View style={styles.breakdown}>
                    {Object.entries(breakdown).map(([mealType, calories]) => {
                        if (calories === 0) return null;
                        return (
                            <View key={mealType} style={styles.breakdownItem}>
                                <View style={styles.breakdownLabel}>
                                    <View
                                        style={[
                                            styles.breakdownDot,
                                            { backgroundColor: theme.colors[mealType] }
                                        ]}
                                    />
                                    <Text style={styles.breakdownType}>
                                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                                    </Text>
                                </View>
                                <Text style={styles.breakdownCalories}>{calories} cal</Text>
                            </View>
                        );
                    })}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    title: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    goal: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    circleContainer: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
    },
    circle: {
        width: 160,
        height: 160,
        borderRadius: 80,
        backgroundColor: theme.colors.backgroundSecondary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: theme.colors.primary,
    },
    totalCalories: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    caloriesLabel: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    remaining: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textLight,
        marginTop: theme.spacing.xs,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: theme.borderRadius.full,
        overflow: 'hidden',
        marginBottom: theme.spacing.lg,
    },
    progressBar: {
        height: '100%',
        borderRadius: theme.borderRadius.full,
    },
    breakdown: {
        gap: theme.spacing.sm,
    },
    breakdownItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: theme.spacing.xs,
    },
    breakdownLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    breakdownDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: theme.spacing.sm,
    },
    breakdownType: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        fontWeight: theme.fontWeight.medium,
    },
    breakdownCalories: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.semibold,
    },
});
