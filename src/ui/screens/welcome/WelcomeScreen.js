import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../styles/useThemedStyles';
import { SnapIllustration, TargetsIllustration, ChatIllustration } from '../../components/illustrations';
import { ChevronRightIcon, KyraLogo } from '../../components/icons';
import { ScreenHeader } from '../../components/common/ScreenHeader';

export const WelcomeScreen = ({ onFinish }) => {
    const { theme, styles } = useThemedStyles(createStyles);
    const { width } = useWindowDimensions();
    const [index, setIndex] = useState(0);

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

    const isLast = index === SLIDES.length - 1;
    const slide = SLIDES[index];
    const Illustration = slide.Illustration;
    const artWidth = Math.min(width * 0.78, 340);

    const handlePrimary = () => {
        if (isLast) {
            onFinish?.();
            return;
        }
        setIndex((current) => Math.min(current + 1, SLIDES.length - 1));
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
            <ScreenHeader />
            <View style={styles.slide}>
                <View style={[styles.artCard, { backgroundColor: `${slide.accent}0D` }]}>
                    <View style={[styles.artBadge, { backgroundColor: `${slide.accent}1A` }]}>
                        <KyraLogo size={16} color={slide.accent} />
                        <Text style={[styles.artBadgeText, { color: slide.accent }]}>Kyra</Text>
                    </View>
                    <Illustration size={artWidth} />
                </View>

                <Text style={styles.title}>{slide.title}</Text>
                <Text style={styles.body}>{slide.body}</Text>
            </View>

            <View style={styles.controls}>
                <TouchableOpacity
                    onPress={() => onFinish?.()}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    accessibilityRole="button"
                    accessibilityLabel="Skip welcome"
                >
                    <Text style={styles.skipText}>{isLast ? '' : 'Skip'}</Text>
                </TouchableOpacity>

                <View style={styles.dots}>
                    {SLIDES.map((item, i) => (
                        <View
                            key={item.key}
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
                    accessibilityRole="button"
                    accessibilityLabel={isLast ? 'Get started' : 'Next'}
                >
                    {isLast ? (
                        <Text style={styles.getStartedText}>Get Started</Text>
                    ) : (
                        <ChevronRightIcon size={18} color={theme.colors.white} strokeWidth={2.4} />
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const createStyles = (theme) => ({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    slide: {
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
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
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
        zIndex: 2,
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
