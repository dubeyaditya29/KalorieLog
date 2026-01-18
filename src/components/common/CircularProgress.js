import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { theme } from '../../styles/theme';

export const CircularProgress = ({
    current,
    goal,
    size = 200,
    strokeWidth = 16
}) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percentage = Math.min((current / goal) * 100, 100);
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    // Determine color based on percentage
    const getColor = () => {
        if (percentage >= 100) return theme.colors.error;
        if (percentage >= 80) return theme.colors.warning;
        return theme.colors.primary;
    };

    const color = getColor();

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                <G rotation="-90" origin={`${size / 2}, ${size / 2}`}>
                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={theme.colors.backgroundTertiary}
                        strokeWidth={strokeWidth}
                        fill="none"
                    />
                    {/* Progress circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                    />
                </G>
            </Svg>

            {/* Center text */}
            <View style={styles.centerContent}>
                <Text style={styles.currentValue}>{current}</Text>
                <Text style={styles.goalValue}>/ {goal}</Text>
                <Text style={styles.label}>calories</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    centerContent: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    currentValue: {
        fontSize: theme.fontSize.huge,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        letterSpacing: -1,
    },
    goalValue: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
        marginTop: -4,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.regular,
        color: theme.colors.textTertiary,
        marginTop: 4,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
