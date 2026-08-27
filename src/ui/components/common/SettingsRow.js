import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useThemedStyles } from '../../styles/useThemedStyles';
import { ChevronRightIcon } from '../icons';

/**
 * A single tappable row for use inside a SectionCard.
 */
export const SettingsRow = ({
    icon: Icon,
    title,
    subtitle,
    value,
    onPress,
    disabled = false,
    destructive = false,
    last = false,
    right = null,
}) => {
    const { theme, styles } = useThemedStyles(createStyles);
    const accent = destructive ? theme.colors.error : theme.colors.primary;
    const tappable = Boolean(onPress) && !disabled && !right;
    const Row = tappable ? TouchableOpacity : View;

    return (
        <Row
            style={[styles.row, !last && styles.divider]}
            {...(tappable
                ? {
                    onPress,
                    disabled,
                    activeOpacity: 0.6,
                }
                : {})}
        >
            {Icon && (
                <View style={[styles.iconWrap, destructive && styles.iconWrapDestructive]}>
                    <Icon size={18} color={accent} />
                </View>
            )}
            <View style={styles.textWrap}>
                <Text style={[styles.title, destructive && styles.titleDestructive]}>
                    {title}
                </Text>
                {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
            {value ? (
                <Text style={[styles.value, destructive && styles.valueDestructive]} numberOfLines={1}>
                    {value}
                </Text>
            ) : null}
            {right}
            {onPress && !disabled && !right && (
                <ChevronRightIcon size={15} color={theme.colors.textLight} strokeWidth={2} />
            )}
        </Row>
    );
};

const createStyles = (theme) => ({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: theme.spacing.md - 2,
        paddingHorizontal: theme.spacing.md,
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.borderLight,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: theme.borderRadius.sm + 1,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md - 2,
    },
    iconWrapDestructive: {
        backgroundColor: 'rgba(255, 59, 48, 0.1)',
    },
    textWrap: {
        flex: 1,
        marginRight: theme.spacing.sm,
    },
    title: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.text,
    },
    titleDestructive: {
        color: theme.colors.error,
    },
    subtitle: {
        fontSize: theme.fontSize.xs,
        color: theme.colors.textTertiary,
        marginTop: 2,
    },
    value: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textTertiary,
        maxWidth: 150,
    },
    valueDestructive: {
        color: theme.colors.error,
    },
});
