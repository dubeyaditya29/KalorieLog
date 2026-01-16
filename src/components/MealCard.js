import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme, getMealTypeColor, getMealTypeIcon } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';

export const MealCard = ({ meal, onPress, onDelete }) => {
    const mealColor = getMealTypeColor(meal.mealType);
    const mealIcon = getMealTypeIcon(meal.mealType);

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatMealType = (type) => {
        return type.charAt(0).toUpperCase() + type.slice(1);
    };

    return (
        <TouchableOpacity
            style={[styles.card, { borderLeftColor: mealColor }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={styles.mealTypeContainer}>
                    <Text style={styles.icon}>{mealIcon}</Text>
                    <View>
                        <Text style={styles.mealType}>{formatMealType(meal.mealType)}</Text>
                        <Text style={styles.time}>{formatTime(meal.timestamp)}</Text>
                    </View>
                </View>
                <View style={styles.caloriesContainer}>
                    <Text style={styles.calories}>{meal.calories}</Text>
                    <Text style={styles.caloriesLabel}>cal</Text>
                </View>
            </View>

            <Text style={styles.description} numberOfLines={2}>
                {meal.description}
            </Text>

            {meal.items && meal.items.length > 0 && (
                <View style={styles.itemsContainer}>
                    {meal.items.slice(0, 3).map((item, index) => (
                        <View key={index} style={[styles.itemTag, { backgroundColor: mealColor + '20' }]}>
                            <Text style={[styles.itemText, { color: mealColor }]} numberOfLines={1}>
                                {item}
                            </Text>
                        </View>
                    ))}
                    {meal.items.length > 3 && (
                        <Text style={styles.moreItems}>+{meal.items.length - 3} more</Text>
                    )}
                </View>
            )}

            {onDelete && (
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => onDelete(meal.id)}
                >
                    <Text style={styles.deleteText}>Delete</Text>
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.md,
        borderLeftWidth: 4,
        ...theme.shadows.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.sm,
    },
    mealTypeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 32,
        marginRight: theme.spacing.sm,
    },
    mealType: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    time: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    caloriesContainer: {
        alignItems: 'flex-end',
    },
    calories: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    caloriesLabel: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    description: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        lineHeight: 20,
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
        alignItems: 'center',
    },
    itemTag: {
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
        maxWidth: 120,
    },
    itemText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
    },
    moreItems: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textLight,
        fontStyle: 'italic',
    },
    deleteButton: {
        marginTop: theme.spacing.sm,
        alignSelf: 'flex-end',
    },
    deleteText: {
        color: theme.colors.error,
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
    },
});
