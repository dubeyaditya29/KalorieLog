import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../styles/theme';

export const MacroRings = ({ protein, carbs, fat, proteinGoal, carbsGoal, fatGoal }) => {
    const size = 180;
    const strokeWidth = 12;
    const center = size / 2;

    // Calculate radii for concentric rings
    const proteinRadius = (size - strokeWidth) / 2 - 5;
    const carbsRadius = proteinRadius - strokeWidth - 5;
    const fatRadius = carbsRadius - strokeWidth - 5;

    const circumference = (radius) => 2 * Math.PI * radius;

    const getProgress = (current, goal) => {
        if (!goal || goal === 0) return 0;
        return Math.min((current / goal) * 100, 100);
    };

    const getStrokeDashoffset = (radius, progress) => {
        const circ = circumference(radius);
        return circ - (circ * progress) / 100;
    };

    const proteinProgress = getProgress(protein, proteinGoal);
    const carbsProgress = getProgress(carbs, carbsGoal);
    const fatProgress = getProgress(fat, fatGoal);

    return (
        <View style={styles.container}>
            <Svg width={size} height={size}>
                {/* Background circles */}
                <Circle
                    cx={center}
                    cy={center}
                    r={proteinRadius}
                    stroke={theme.colors.border}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={center}
                    cy={center}
                    r={carbsRadius}
                    stroke={theme.colors.border}
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                <Circle
                    cx={center}
                    cy={center}
                    r={fatRadius}
                    stroke={theme.colors.border}
                    strokeWidth={strokeWidth}
                    fill="none"
                />

                {/* Protein ring (outermost - blue) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={proteinRadius}
                    stroke="#0A84FF"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference(proteinRadius)}
                    strokeDashoffset={getStrokeDashoffset(proteinRadius, proteinProgress)}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />

                {/* Carbs ring (middle - yellow) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={carbsRadius}
                    stroke="#FFD60A"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference(carbsRadius)}
                    strokeDashoffset={getStrokeDashoffset(carbsRadius, carbsProgress)}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />

                {/* Fat ring (innermost - red) */}
                <Circle
                    cx={center}
                    cy={center}
                    r={fatRadius}
                    stroke="#FF453A"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference(fatRadius)}
                    strokeDashoffset={getStrokeDashoffset(fatRadius, fatProgress)}
                    strokeLinecap="round"
                    transform={`rotate(-90 ${center} ${center})`}
                />
            </Svg>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#0A84FF' }]} />
                    <Text style={styles.legendText}>
                        Protein: {protein}g / {proteinGoal}g
                    </Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FFD60A' }]} />
                    <Text style={styles.legendText}>
                        Carbs: {carbs}g / {carbsGoal}g
                    </Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: '#FF453A' }]} />
                    <Text style={styles.legendText}>
                        Fat: {fat}g / {fatGoal}g
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: theme.spacing.lg,
    },
    legend: {
        marginTop: theme.spacing.lg,
        width: '100%',
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    legendDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: theme.spacing.sm,
    },
    legendText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        fontWeight: theme.fontWeight.medium,
    },
});
