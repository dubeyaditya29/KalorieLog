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

export const MoonIcon = (props) => (
    <Base {...props}>
        <Path d="M17.2 15.4A7.1 7.1 0 0 1 9.4 7.2 7.5 7.5 0 1 0 17.2 15.4Z" />
    </Base>
);

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

const KYRA_LOGO_PATH =
    'M8.46289 18.5911C8.46287 16.8205 9.13032 14.1735 11.1262 11.9805C13.0948 9.81741 16.4436 8 21.997 8C24.8969 8 26.7944 8.35253 28.218 8.91692C29.6317 9.47742 30.6517 10.2748 31.7777 11.3038C31.8673 11.3856 31.9532 11.4638 32.0356 11.5387C32.9207 12.3441 33.3979 12.7783 33.6509 13.4426C34.9272 16.7931 37.1986 21.6057 38.6703 24.6413C39.0005 25.3224 38.5008 26.112 37.7572 26.112H35.56V33C35.56 33.5523 35.1123 34 34.56 34H29.1151C29.0703 33.9949 29.0246 33.9927 28.9782 33.9937C28.8057 33.9975 28.6396 33.9996 28.4792 34H28.352C26.0659 33.9936 24.964 33.6422 23.3377 33.0588C22.8179 32.8723 22.2453 33.1425 22.0588 33.6624C21.8723 34.1822 22.1425 34.7548 22.6624 34.9413C24.209 35.4962 25.4159 35.8815 27.4073 35.9769V42H29.4073V36H34.56C36.2169 36 37.56 34.6569 37.56 33V28.112H37.7572C39.9903 28.112 41.4383 25.7661 40.4699 23.7687C38.9957 20.7281 36.7609 15.9887 35.5199 12.7307C35.0859 11.5912 34.2313 10.8223 33.4212 10.0935C33.3222 10.0044 33.2238 9.91586 33.1269 9.82736C31.9317 8.73512 30.7005 7.74968 28.9551 7.05771C27.2195 6.36963 25.05 6 21.997 6C15.9684 6 12.05 7.99392 9.64707 10.6343C7.27141 13.2447 6.46286 16.3932 6.46289 18.5911C6.46296 24.2512 9.66061 28.6551 11.4999 30.6382V42H13.4999V29.8311L13.2151 29.5396C11.5944 27.8812 8.46295 23.7903 8.46289 18.5911Z';

/** Brand mark (filled, 48×48). Color follows the theme at call time. */
export const KyraLogo = ({ size = 48, color = '#007AFF', ...rest }) => (
    <Svg width={size} height={size} viewBox="0 0 48 48" fill="none" {...rest}>
        <Path d={KYRA_LOGO_PATH} fill={color} />
    </Svg>
);
