import React from 'react';
import Svg, { Path, Circle, Rect, G, Line } from 'react-native-svg';
import { theme } from '../../styles/theme';

/**
 * Hand-drawn illustration scenes for the welcome carousel.
 * Same stroke family as the app icon set (rounded caps, consistent weights),
 * composed into little product stories instead of generic stock art.
 */

const base = {
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

const Dots = ({ points, color }) =>
    points.map(([x, y, r], i) => <Circle key={i} cx={x} cy={y} r={r} fill={color} />);

// Slide 1 — Snap a photo, AI logs it
export const SnapIllustration = ({ size = 280 }) => (
    <Svg width={size} height={size * 0.72} viewBox="0 0 280 200">
        {/* backdrop */}
        <Circle cx={140} cy={104} r={78} stroke={`${theme.colors.primary}26`} strokeWidth={1.5} strokeDasharray="4 7" {...base} />
        <Dots color={`${theme.colors.primary}30`} points={[[38, 52, 4], [246, 148, 5], [222, 30, 3]]} />

        {/* camera */}
        <G>
            <Rect x={44} y={78} width={92} height={66} rx={15} stroke={theme.colors.primary} strokeWidth={3} {...base} />
            <Path d="M68 78l9-13h26l9 13" stroke={theme.colors.primary} strokeWidth={3} {...base} />
            <Circle cx={90} cy={111} r={19} stroke={theme.colors.primary} strokeWidth={3} {...base} />
            <Circle cx={122} cy={93} r={3} fill={theme.colors.primary} />
        </G>

        {/* dashed transfer arc */}
        <Path d="M146 96c22-16 46-14 62 6" stroke={theme.colors.primaryLight} strokeWidth={2.5} strokeDasharray="2 8" {...base} />
        <Path d="M203 94l6 9-11 1" stroke={theme.colors.primaryLight} strokeWidth={2.5} {...base} />

        {/* plate */}
        <G>
            <Circle cx={216} cy={128} r={34} stroke={theme.colors.dinner} strokeWidth={3} fill="#fff" />
            <Circle cx={216} cy={128} r={21} stroke={`${theme.colors.dinner}55`} strokeWidth={2} strokeDasharray="3 6" {...base} />
            <Path d="M208 124c3-6 10-8 15-5" stroke={theme.colors.snack} strokeWidth={2.5} {...base} />
            <Path d="M206 133c6 4 15 3 20-3" stroke={theme.colors.success} strokeWidth={2.5} {...base} />
        </G>

        {/* sparkle */}
        <Path d="M232 44c1 5.5 4 8.5 9.5 9.5-5.5 1-8.5 4-9.5 9.5-1-5.5-4-8.5-9.5-9.5 5.5-1 8.5-4 9.5-9.5Z" stroke={theme.colors.amber} strokeWidth={2.5} {...base} />
    </Svg>
);

// Slide 2 — Personal targets, macros at a glance
export const TargetsIllustration = ({ size = 280 }) => (
    <Svg width={size} height={size * 0.72} viewBox="0 0 280 200">
        <Circle cx={140} cy={104} r={78} stroke={`${theme.colors.lunch}26`} strokeWidth={1.5} strokeDasharray="4 7" {...base} />
        <Dots color={`${theme.colors.lunch}30`} points={[[46, 150, 4], [240, 56, 5]]} />

        {/* calorie ring */}
        <Circle cx={98} cy={104} r={40} stroke={theme.colors.backgroundTertiary} strokeWidth={9} {...base} />
        <Circle
            cx={98} cy={104} r={40}
            stroke={theme.colors.primary} strokeWidth={9}
            strokeDasharray="188 251"
            strokeLinecap="round"
            transform="rotate(-90 98 104)"
            {...base}
        />
        <Path d="M88 104l7 7 13-15" stroke={theme.colors.success} strokeWidth={3.5} {...base} />

        {/* macro bars */}
        {[['#007AFF', 158, 52], [theme.colors.amber, 186, 76], [theme.colors.error, 214, 38]].map(([color, x, h], i) => (
            <G key={i}>
                <Rect x={x} y={142 - 52} width={17} height={104} rx={8.5} fill={theme.colors.backgroundTertiary} stroke="none" />
                <Rect x={x} y={142 - h} width={17} height={h} rx={8.5} fill={color} stroke="none" opacity={0.85} />
                <Line x1={x - 4} y1={146} x2={x + 21} y2={146} stroke={theme.colors.border} strokeWidth={2} {...base} />
            </G>
        ))}

        {/* target flag */}
        <G>
            <Line x1={248} y1={58} x2={248} y2={96} stroke={theme.colors.textTertiary} strokeWidth={2.5} {...base} />
            <Path d="M248 58c8 0 12 4 12 4v14s-4-4-12-4Z" stroke={theme.colors.success} strokeWidth={2.5} fill={`${theme.colors.success}22`} {...base} />
        </G>
    </Svg>
);

// Slide 3 — Ask your assistant anything
export const ChatIllustration = ({ size = 280 }) => (
    <Svg width={size} height={size * 0.72} viewBox="0 0 280 200">
        <Circle cx={140} cy={104} r={78} stroke={`${theme.colors.breakfast}26`} strokeWidth={1.5} strokeDasharray="4 7" {...base} />
        <Dots color={`${theme.colors.breakfast}30`} points={[[42, 60, 4], [238, 140, 5]]} />

        {/* question bubble (left) */}
        <G transform="translate(-14 0)">
            <Path d="M60 74a14 14 0 0 1 14-14h84a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14h-72L64 138l4-16h-8a14 14 0 0 1-14-14Z"
                stroke={theme.colors.primary} strokeWidth={3} fill="#fff" {...base} />
            <Dots color={theme.colors.primary} points={[[74, 91, 3.5], [92, 91, 3.5], [110, 91, 3.5]]} />
        </G>

        {/* answer bubble (right, tinted) */}
        <G>
            <Path d="M136 132a13 13 0 0 1 13-13h62a13 13 0 0 1 13 13v28a13 13 0 0 1-13 13h-56l-19 14 5-14h-5a13 13 0 0 1-13-13Z"
                fill={theme.colors.primarySoft} stroke={theme.colors.primary} strokeWidth={2.5} {...base} />
            <Line x1={152} y1={134} x2={204} y2={134} stroke={theme.colors.primary} strokeWidth={3} {...base} />
            <Line x1={152} y1={146} x2={190} y2={146} stroke={`${theme.colors.primary}77`} strokeWidth={3} {...base} />
        </G>

        {/* sparkle */}
        <Path d="M228 52c.8 4.6 3.3 7.1 8 8-4.7.9-7.2 3.4-8 8-.8-4.6-3.3-7.1-8-8 4.7-.9 7.2-3.4 8-8Z" stroke={theme.colors.dinner} strokeWidth={2.5} {...base} />
    </Svg>
);
