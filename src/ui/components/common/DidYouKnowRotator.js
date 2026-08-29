import React, { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { ANALYSIS_DID_YOU_KNOW } from '../../../logic/constants/messages';
import { useThemedStyles } from '../../styles/useThemedStyles';

const ROTATE_MS = 4500;

export const DidYouKnowRotator = ({ intervalMs = ROTATE_MS }) => {
    const { styles } = useThemedStyles(createStyles);
    const facts = ANALYSIS_DID_YOU_KNOW;
    const [index, setIndex] = useState(() => Math.floor(Math.random() * facts.length));
    const opacity = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        let cancelled = false;
        const tick = () => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 220,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (!finished || cancelled) return;
                setIndex((current) => (current + 1) % facts.length);
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 320,
                    useNativeDriver: true,
                }).start();
            });
        };
        const id = setInterval(tick, intervalMs);
        return () => {
            cancelled = true;
            clearInterval(id);
        };
    }, [facts.length, intervalMs, opacity]);

    return (
        <View style={styles.card}>
            <Text style={styles.kicker}>Did you know?</Text>
            <Animated.Text style={[styles.fact, { opacity }]}>
                {facts[index]}
            </Animated.Text>
        </View>
    );
};

const createStyles = (theme) => ({
    card: {
        width: '100%',
        marginTop: theme.spacing.md,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        backgroundColor: theme.colors.primarySoft,
        minHeight: 108,
    },
    kicker: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.6,
        marginBottom: theme.spacing.sm,
    },
    fact: {
        fontSize: theme.fontSize.sm,
        lineHeight: 20,
        color: theme.colors.text,
        fontWeight: theme.fontWeight.medium,
    },
});
