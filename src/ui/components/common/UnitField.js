import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../../styles/theme';

const round1 = (n) => Math.round(n * 10) / 10;

/**
 * Numeric input with an imperial/metric unit toggle.
 * Parent always receives the canonical metric value (cm or kg).
 *
 * @param {string} label
 * @param {'height'|'weight'} kind - height (cm/in) or weight (kg/lb)
 * @param {number|null} canonicalValue - value in cm or kg
 * @param {Function} onChange - receives canonical value in cm or kg (number|null)
 */
export const UnitField = ({ label, kind, canonicalValue, onChange }) => {
    const isHeight = kind === 'height';
    const [unit, setUnit] = useState(isHeight ? 'cm' : 'kg');
    const [display, setDisplay] = useState('');

    const toDisplay = (v) => {
        if (v === null || v === undefined || isNaN(v)) return '';
        return isHeight
            ? (unit === 'cm' ? String(round1(v)) : String(round1(v / 2.54)))
            : (unit === 'kg' ? String(round1(v)) : String(round1(v * 2.20462)));
    };

    // Sync display when canonical value changes externally (e.g. profile load)
    useEffect(() => {
        setDisplay(toDisplay(canonicalValue));
    }, [canonicalValue]);

    const handleUnitSwitch = (newUnit) => {
        if (newUnit === unit) return;
        // Convert current display to the new unit so the number follows
        const num = parseFloat(display);
        let newDisplay = '';
        if (!isNaN(num)) {
            if (isHeight) {
                newDisplay = String(round1(newUnit === 'in' ? num / 2.54 : num * 2.54));
            } else {
                newDisplay = String(round1(newUnit === 'lb' ? num * 2.20462 : num / 2.20462));
            }
        }
        setUnit(newUnit);
        setDisplay(newDisplay);
    };

    const handleChange = (text) => {
        // Allow digits and one decimal point only
        const cleaned = text.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');
        setDisplay(cleaned);
        const num = parseFloat(cleaned);
        if (isNaN(num)) {
            onChange(null);
            return;
        }
        const canonical = isHeight
            ? (unit === 'cm' ? num : num * 2.54)
            : (unit === 'kg' ? num : num / 2.20462);
        onChange(round1(canonical));
    };

    return (
        <View style={styles.wrapper}>
            <Text style={styles.label}>{label}</Text>
            <View style={[styles.inputRow, display !== '' && styles.inputRowFilled]}>
                <TextInput
                    style={styles.input}
                    value={display}
                    onChangeText={handleChange}
                    placeholder="0"
                    placeholderTextColor={theme.colors.textLight}
                    keyboardType="decimal-pad"
                />
                <View style={styles.unitToggle}>
                    {(isHeight ? ['cm', 'in'] : ['kg', 'lb']).map((u) => (
                        <TouchableOpacity
                            key={u}
                            style={[styles.unitOption, unit === u && styles.unitOptionActive]}
                            onPress={() => handleUnitSwitch(u)}
                        >
                            <Text style={[styles.unitText, unit === u && styles.unitTextActive]}>
                                {u}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        marginBottom: theme.spacing.md,
    },
    label: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
        textTransform: 'capitalize',
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        overflow: 'hidden',
    },
    inputRowFilled: {
        borderColor: theme.colors.primary,
    },
    input: {
        flex: 1,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.text,
    },
    unitToggle: {
        flexDirection: 'row',
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: theme.borderRadius.sm,
        margin: 4,
    },
    unitOption: {
        paddingHorizontal: theme.spacing.md - 2,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.sm,
    },
    unitOptionActive: {
        backgroundColor: theme.colors.primary,
    },
    unitText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        textTransform: 'uppercase',
    },
    unitTextActive: {
        color: theme.colors.white,
    },
});
