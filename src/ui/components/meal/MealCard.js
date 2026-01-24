import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { theme, getMealTypeColor } from '../../styles/theme';
import { deleteMeal } from '../../../logic/services/storageService';

export const MealCard = ({ meal, onDelete }) => {
    const handleDelete = () => {
        Alert.alert(
            'Delete Meal',
            'Are you sure you want to delete this meal?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteMeal(meal.id);
                            if (onDelete) onDelete();
                        } catch (error) {
                            console.error('Error deleting meal:', error);
                            Alert.alert('Error', 'Failed to delete meal');
                        }
                    },
                },
            ]
        );
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
        });
    };

    return (
        <View style={styles.card}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{formatTime(meal.timestamp)}</Text>
                    </View>
                    <View style={styles.caloriesContainer}>
                        <Text style={styles.calories}>{meal.calories}</Text>
                        <Text style={styles.caloriesLabel}>cal</Text>
                    </View>
                </View>

                {meal.description && (
                    <Text style={styles.description} numberOfLines={2}>
                        {meal.description}
                    </Text>
                )}

                {meal.items && meal.items.length > 0 && (
                    <View style={styles.itemsContainer}>
                        {meal.items.slice(0, 3).map((item, index) => (
                            <View key={index} style={styles.itemBadge}>
                                <Text style={styles.itemText} numberOfLines={1}>
                                    {item}
                                </Text>
                            </View>
                        ))}
                        {meal.items.length > 3 && (
                            <View style={styles.itemBadge}>
                                <Text style={styles.itemText}>+{meal.items.length - 3}</Text>
                            </View>
                        )}
                    </View>
                )}
            </View>

            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                <Text style={styles.deleteIcon}>×</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    timeContainer: {
        flex: 1,
    },
    time: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    caloriesContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    calories: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        letterSpacing: -0.5,
    },
    caloriesLabel: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textTertiary,
        marginLeft: 2,
    },
    description: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.regular,
        color: theme.colors.textSecondary,
        lineHeight: 18,
        marginBottom: theme.spacing.sm,
    },
    itemsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.xs,
    },
    itemBadge: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.sm,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    itemText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    deleteButton: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: theme.colors.error,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: theme.spacing.sm,
    },
    deleteIcon: {
        fontSize: 18,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.white,
        lineHeight: 18,
    },
});
