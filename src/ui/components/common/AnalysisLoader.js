import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { theme } from '../../styles/theme';
import { SparklesIcon } from '../icons';

/**
 * Round animated loader shown while Gemini analyzes a meal photo.
 * Combines an expanding pulse ring, a spinning arc and a breathing inner disc.
 */
export const AnalysisLoader = ({ size = 140, label = 'Analyzing your meal…' }) => {
    const spin = useRef(new Animated.Value(0)).current;
    const pulse = useRef(new Animated.Value(0)).current;
    const breathe = useRef(new Animated.Value(0)).current;

    const ringSize = size;
    const radius = (ringSize - 14) / 2;
    const circumference = 2 * Math.PI * radius;

    useEffect(() => {
        const spinLoop = Animated.loop(
            Animated.timing(spin, {
                toValue: 1,
                duration: 1400,
                easing: Easing.linear,
                useNativeDriver: true,
            })
        );

        const pulseLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(pulse, {
                    toValue: 0,
                    duration: 1,
                    useNativeDriver: true,
                }),
                Animated.delay(500),
            ])
        );

        const breatheLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(breathe, {
                    toValue: 1,
                    duration: 900,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
                Animated.timing(breathe, {
                    toValue: 0,
                    duration: 900,
                    easing: Easing.inOut(Easing.quad),
                    useNativeDriver: true,
                }),
            ])
        );

        spinLoop.start();
        pulseLoop.start();
        breatheLoop.start();

        return () => {
            spinLoop.stop();
            pulseLoop.stop();
            breatheLoop.stop();
        };
    }, [spin, pulse, breathe]);

    const spinInterpolate = spin.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg'],
    });

    const pulseScale = pulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1.35],
    });

    const pulseOpacity = pulse.interpolate({
        inputRange: [0, 0.7, 1],
        outputRange: [0.5, 0.15, 0],
    });

    const innerScale = breathe.interpolate({
        inputRange: [0, 1],
        outputRange: [0.92, 1.05],
    });

    return (
        <View style={styles.container}>
            <View style={{ width: ringSize, height: ringSize, alignItems: 'center', justifyContent: 'center' }}>
                {/* Expanding pulse ring */}
                <Animated.View
                    style={[
                        styles.pulseRing,
                        {
                            width: ringSize,
                            height: ringSize,
                            borderRadius: ringSize / 2,
                            transform: [{ scale: pulseScale }],
                            opacity: pulseOpacity,
                        },
                    ]}
                />
                {/* Spinning arc */}
                <Animated.View style={[styles.arcWrapper, { transform: [{ rotate: spinInterpolate }] }]}>
                    <Svg width={ringSize} height={ringSize}>
                        <Circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            stroke={theme.colors.primarySoft}
                            strokeWidth={7}
                            fill="none"
                        />
                        <Circle
                            cx={ringSize / 2}
                            cy={ringSize / 2}
                            r={radius}
                            stroke={theme.colors.primary}
                            strokeWidth={7}
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${circumference * 0.28} ${circumference}`}
                        />
                    </Svg>
                </Animated.View>
                {/* Breathing center disc */}
                <Animated.View
                    style={[
                        styles.centerDisc,
                        { transform: [{ scale: innerScale }] },
                    ]}
                >
                    <SparklesIcon size={30} color={theme.colors.primary} strokeWidth={1.8} />
                </Animated.View>
            </View>
            <Text style={styles.label}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl,
    },
    arcWrapper: {
        position: 'absolute',
    },
    pulseRing: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: theme.colors.primaryLight,
    },
    centerDisc: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        marginTop: theme.spacing.lg,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
});
