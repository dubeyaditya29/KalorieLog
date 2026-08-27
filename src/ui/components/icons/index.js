import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

/**
 * Hand-drawn icon set for Kyra.
 * All icons share a 24x24 grid, 1.8 stroke weight and rounded caps so they
 * read as one family. Color follows the theme at call time.
 */

const Base = ({ size = 24, color = '#0F172A', strokeWidth = 1.8, children, ...rest }) => (
    <Svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        {...rest}
    >
        {children}
    </Svg>
);

const Dot = ({ cx, cy, r = 1, color }) => (
    <Circle cx={cx} cy={cy} r={r} fill={color} stroke="none" />
);

// ── Tab icons ────────────────────────────────────────────────

export const NutritionIcon = (props) => (
    <Base {...props}>
        <Path d="M4.5 13.5h15a7.5 7.5 0 0 1-15 0Z" />
        <Path d="M12 13.5V10" />
        <Path d="M12 10c0-3.3 2.2-5.5 5.5-5.5 0 3.3-2.2 5.5-5.5 5.5Z" />
    </Base>
);

export const ChatIcon = ({ color = '#0F172A', ...props }) => (
    <Base color={color} {...props}>
        <Path d="M21 15a2 2 0 0 1-2 2H7.5L3.5 20.5V5a2 2 0 0 1 2-2H19a2 2 0 0 1 2 2Z" />
        <Dot cx={8.5} cy={10} color={color} />
        <Dot cx={12} cy={10} color={color} />
        <Dot cx={15.5} cy={10} color={color} />
    </Base>
);

export const ProfileIcon = (props) => (
    <Base {...props}>
        <Circle cx="12" cy="8" r="3.6" />
        <Path d="M5.5 19.5c1.2-3.4 3.7-5 6.5-5s5.3 1.6 6.5 5" />
    </Base>
);

// ── Meal type icons ──────────────────────────────────────────

export const BreakfastIcon = (props) => (
    <Base {...props}>
        <Path d="M3 18.5h18" />
        <Path d="M8 18.5a4 4 0 0 1 8 0" />
        <Path d="M12 6.5v-3" />
        <Path d="M5.5 10 7.3 11.8" />
        <Path d="M18.5 10l-1.8 1.8" />
    </Base>
);

export const LunchIcon = (props) => (
    <Base {...props}>
        <Circle cx="12" cy="12" r="4" />
        <Path d="M12 2.5V5" />
        <Path d="M12 19v2.5" />
        <Path d="M2.5 12H5" />
        <Path d="M19 12h2.5" />
        <Path d="m5.3 5.3 1.7 1.7" />
        <Path d="m17 17 1.7 1.7" />
        <Path d="M18.7 5.3 17 7" />
        <Path d="m7 17-1.7 1.7" />
    </Base>
);

export const DinnerIcon = (props) => (
    <Base {...props}>
        <Path d="M20.2 12.8A8.2 8.2 0 1 1 11.2 3.8a6.4 6.4 0 0 0 9 9Z" />
    </Base>
);

export const SnackIcon = ({ color = '#0F172A', ...props }) => (
    <Base color={color} {...props}>
        <Circle cx="12" cy="12" r="7.5" />
        <Dot cx={9.3} cy={9.8} color={color} />
        <Dot cx={14.8} cy={10.2} color={color} />
        <Dot cx={11.2} cy={13.9} color={color} />
        <Dot cx={15} cy={14.2} color={color} />
    </Base>
);

// ── Actions ──────────────────────────────────────────────────

export const CameraIcon = (props) => (
    <Base {...props}>
        <Rect x="3.5" y="7.5" width="17" height="12.5" rx="2.5" />
        <Path d="M9 7.5 10 5h4l1 2.5" />
        <Circle cx="12" cy="13.5" r="3.4" />
    </Base>
);

export const ImageIcon = ({ color = '#0F172A', ...props }) => (
    <Base color={color} {...props}>
        <Rect x="3.5" y="4.5" width="17" height="15" rx="2.5" />
        <Dot cx={9} cy={9.5} r={1.4} color={color} />
        <Path d="m6 16.5 3.8-4.2 3.2 3.4 2.2-2.4 3.8 3.2" />
    </Base>
);

export const CloseIcon = (props) => (
    <Base {...props}>
        <Path d="m6.5 6.5 11 11" />
        <Path d="m17.5 6.5-11 11" />
    </Base>
);

export const SendIcon = (props) => (
    <Base {...props}>
        <Path d="M20.5 3.5 10.8 13.2" />
        <Path d="M20.5 3.5 14.3 20.5l-3.5-7.3-7.3-3.5Z" />
    </Base>
);

export const PlusIcon = (props) => (
    <Base {...props}>
        <Path d="M12 5.5v13" />
        <Path d="M5.5 12h13" />
    </Base>
);

export const TrashIcon = (props) => (
    <Base {...props}>
        <Path d="M4.5 6.5h15" />
        <Path d="M9.5 6.5V5a1.5 1.5 0 0 1 1.5-1.5h2A1.5 1.5 0 0 1 14.5 5v1.5" />
        <Path d="m6.5 6.5.8 12.6a2 2 0 0 0 2 1.9h5.4a2 2 0 0 0 2-1.9l.8-12.6" />
        <Path d="M10 10.5v6" />
        <Path d="M14 10.5v6" />
    </Base>
);

export const EditIcon = (props) => (
    <Base {...props}>
        <Path d="M16.8 3.7a2.12 2.12 0 0 1 3 3L7.5 19 3 20l1-4.5L16.8 3.7Z" />
        <Path d="m14.5 6 3.5 3.5" />
    </Base>
);

export const LogoutIcon = ({ color = '#0F172A', ...props }) => (
    <Base color={color} {...props}>
        <Path d="M14 7.5V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1.5" />
        <Path d="M9.5 12H20.5" />
        <Path d="m17 8.5 3.5 3.5-3.5 3.5" />
    </Base>
);

export const CheckIcon = (props) => (
    <Base {...props}>
        <Path d="m5 12.5 4.5 4.5L19 7.5" />
    </Base>
);

export const ChevronLeftIcon = (props) => (
    <Base {...props}>
        <Path d="m14.5 5.5-6.5 6.5 6.5 6.5" />
    </Base>
);

export const ChevronRightIcon = (props) => (
    <Base {...props}>
        <Path d="m9.5 5.5 6.5 6.5-6.5 6.5" />
    </Base>
);

// ── Feature icons ────────────────────────────────────────────

export const SparklesIcon = (props) => (
    <Base {...props}>
        <Path d="M10 3.5c.55 3.1 2.35 4.9 5.5 5.5-3.15.6-4.95 2.4-5.5 5.5-.55-3.1-2.35-4.9-5.5-5.5 3.15-.6 4.95-2.4 5.5-5.5Z" />
        <Path d="M18 13.5c.3 1.7 1.3 2.7 3 3-1.7.3-2.7 1.3-3 3-.3-1.7-1.3-2.7-3-3 1.7-.3 2.7-1.3 3-3Z" />
    </Base>
);

export const FlameIcon = (props) => (
    <Base {...props}>
        <Path d="M12 3.5c2.6 2.8 4.7 5.5 4.7 8.3a4.7 4.7 0 0 1-9.4 0c0-2.8 2.1-5.5 4.7-8.3Z" />
        <Path d="M12 12.2c.9 1 1.4 1.9 1.4 2.8a1.4 1.4 0 1 1-2.8 0c0-.9.5-1.8 1.4-2.8Z" />
    </Base>
);

export const ScaleIcon = (props) => (
    <Base {...props}>
        <Rect x="3.75" y="3.75" width="16.5" height="16.5" rx="3" />
        <Path d="M8.2 9.5a3.8 3.8 0 0 1 7.6 0" />
        <Path d="m12 9.5 1.8-1.8" />
    </Base>
);

export const RulerIcon = (props) => (
    <Base {...props}>
        <Rect x="2.75" y="9" width="18.5" height="6" rx="1.5" />
        <Path d="M7 9v3" />
        <Path d="M11 9v3" />
        <Path d="M15 9v3" />
        <Path d="M19 9v3" />
    </Base>
);
