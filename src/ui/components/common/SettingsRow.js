import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';
import { ChevronRightIcon } from '../icons';

/**
 * A single tappable row for use inside a SectionCard.
 *
 * @param {Component} icon - icon component rendered in a tinted circle
 * @param {string} title - primary label
 * @param {string} subtitle - secondary line under the title
 * @param {string} value - right-aligned summary text (e.g. "25 yrs · 70 kg")
 * @param {boolean} destructive - renders title/icon/value in error color
 * @param {boolean} last - removes the bottom divider (use on the final row)
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
}) => {
    const accent = destructive ? theme.colors.error : theme.colors.primary;

    return (
        <TouchableOpacity
            style={[styles.row, !last && styles.divider]}
            onPress={onPress}
            disabled={disabled || !onPress}
            activeOpacity={onPress && !disabled ? 0.6 : 1}
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
            {onPress && !disabled && (
                <ChevronRightIcon size={15} color={theme.colors.textLight} strokeWidth={2} />
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
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
