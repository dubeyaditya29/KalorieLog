import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { theme } from '../../styles/theme';
import { SnapIllustration, TargetsIllustration, ChatIllustration } from '../../components/illustrations';
import { ChevronLeftIcon } from '../../components/icons';

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        key: 'snap',
        title: 'Log meals with a snap',
        body: 'Point your camera at any plate. AI reads the calories, protein, carbs and fat for you — no searching food databases.',
        Illustration: SnapIllustration,
        accent: theme.colors.primary,
    },
    {
        key: 'targets',
        title: 'Targets made for your body',
        body: 'Tell us your age, height and weight — in kg or lb, cm or inches. We turn your BMI into daily calorie and macro goals.',
        Illustration: TargetsIllustration,
        accent: theme.colors.lunch,
    },
    {
        key: 'chat',
        title: 'A nutritionist in your pocket',
        body: 'Ask anything, anytime. Your assistant knows your goals and helps you choose smarter meals throughout the day.',
        Illustration: ChatIllustration,
        accent: theme.colors.dinner,
    },
];

export const WelcomeScreen = ({ onFinish }) => {
    const scrollRef = useRef(null);
    const [index, setIndex] = useState(0);

    const isLast = index === SLIDES.length - 1;

    const goTo = (i) => {
        scrollRef.current?.scrollTo({ x: i * width, animated: true });
    };

    const handlePrimary = () => {
        if (isLast) {
            onFinish?.();
        } else {
            goTo(index + 1);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                ref={scrollRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                    const i = Math.round(e.nativeEvent.contentOffset.x / width);
                    if (i !== index) setIndex(i);
                }}
            >
                {SLIDES.map(({ key, title, body, Illustration, accent }) => (
                    <View key={key} style={styles.slide}>
                        <View style={[styles.artCard, { backgroundColor: `${accent}0D` }]}>
                            <View style={[styles.artBadge, { backgroundColor: `${accent}1A` }]}>
                                <Text style={[styles.artBadgeText, { color: accent }]}>Kyra</Text>
                            </View>
                            <Illustration size={width * 0.78} />
                        </View>

                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.body}>{body}</Text>
                    </View>
                ))}
            </ScrollView>

            <View style={styles.controls}>
                <TouchableOpacity onPress={() => goTo(SLIDES.length - 1)} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
                    <Text style={styles.skipText}>{isLast ? '' : 'Skip'}</Text>
                </TouchableOpacity>

                <View style={styles.dots}>
                    {SLIDES.map((slide, i) => (
                        <View
                            key={slide.key}
                            style={[
                                styles.dot,
                                i === index && [styles.dotActive, { backgroundColor: SLIDES[i].accent }],
                            ]}
                        />
                    ))}
                </View>

                <TouchableOpacity
                    style={[styles.nextButton, isLast && styles.nextButtonLast]}
                    onPress={handlePrimary}
                    activeOpacity={0.85}
                >
                    {isLast ? (
                        <Text style={styles.getStartedText}>Get Started</Text>
                    ) : (
                        <ChevronLeftIcon size={18} color={theme.colors.white} strokeWidth={2.4} style={{ transform: [{ rotate: '180deg' }] }} />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    slide: {
        width,
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xl,
        paddingTop: theme.spacing.xl,
    },
    artCard: {
        width: '100%',
        borderRadius: theme.borderRadius.xl + 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl,
        marginBottom: theme.spacing.xl,
    },
    artBadge: {
        position: 'absolute',
        top: theme.spacing.md,
        left: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: 5,
        borderRadius: theme.borderRadius.full,
    },
    artBadgeText: {
        fontSize: theme.fontSize.xs,
        fontWeight: theme.fontWeight.bold,
        letterSpacing: 0.5,
    },
    title: {
        fontSize: theme.fontSize.xxl + 2,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
        letterSpacing: -0.5,
    },
    body: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginTop: theme.spacing.md,
        maxWidth: 300,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.xl,
        paddingBottom: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    skipText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textTertiary,
        minWidth: 44,
    },
    dots: {
        flexDirection: 'row',
        gap: 7,
        alignItems: 'center',
    },
    dot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: theme.colors.border,
    },
    dotActive: {
        width: 20,
    },
    nextButton: {
        minWidth: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...theme.shadows.md,
    },
    nextButtonLast: {
        flex: 1,
        marginLeft: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        height: 50,
    },
    getStartedText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.white,
    },
});
