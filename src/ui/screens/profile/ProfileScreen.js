import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ScrollView,
    ActivityIndicator,
} from 'react-native';
import { useThemedStyles } from '../../styles/useThemedStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { getProfile } from '../../../logic/services/api/profileService';
import { signOut } from '../../../logic/services/api/authService';
import { useModal } from '../../components/common/ThemedModal';
import { SectionCard, SettingsRow } from '../../components/common';
import { ProfileIcon, LogoutIcon } from '../../components/icons';
import { calculateBMI, getBMICategory, getBMIColor } from '../../../logic/utils/bmiCalculator';

export const ProfileScreen = ({ navigation }) => {
    const { theme, styles, globalStyles } = useThemedStyles(createStyles);
    const { user, profileVersion } = useAuth();
    const { showDestructive } = useModal();
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        loadProfile();
    }, [profileVersion]);

    const loadProfile = async () => {
        try {
            const { data, error } = await getProfile(user.id);

            if (error) {
                console.error('Load profile error:', error);
                return;
            }

            setProfile(data);
        } catch (error) {
            console.error('Error loading profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignOut = () => {
        showDestructive(
            'Sign Out',
            'Are you sure you want to sign out?',
            'Sign Out',
            signOut
        );
    };

    const displayName = profile?.name?.trim() || '';
    const initials =
        displayName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((w) => w[0].toUpperCase())
            .join('') || user?.email?.[0]?.toUpperCase() || '?';

    const isComplete = !!(displayName && profile?.age && profile?.height_cm && profile?.weight_kg);

    const currentBMI =
        profile?.height_cm && profile?.weight_kg
            ? calculateBMI(profile.weight_kg, profile.height_cm)
            : null;

    const detailsSummary = isComplete
        ? `${profile.age} yrs · ${Math.round(profile.height_cm)} cm · ${Math.round(profile.weight_kg)} kg`
        : null;

    if (loading) {
        return (
            <View style={[globalStyles.safeArea, styles.loadingContainer]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <ScrollView
                style={styles.container}
                contentContainerStyle={styles.content}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Profile</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                {/* Identity card */}
                <View style={styles.identityCard}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <View style={styles.identityInfo}>
                        <Text style={styles.identityName} numberOfLines={1}>
                            {displayName || 'Welcome!'}
                        </Text>
                        {currentBMI ? (
                            <View style={styles.bmiBadge}>
                                <View style={[styles.bmiDot, { backgroundColor: getBMIColor(currentBMI) }]} />
                                <Text style={styles.bmiText}>
                                    BMI {currentBMI.toFixed(1)} · {getBMICategory(currentBMI)}
                                </Text>
                            </View>
                        ) : (
                            <Text style={styles.identityPrompt}>Set up your details to get started</Text>
                        )}
                    </View>
                </View>

                {/* Personal section */}
                <SectionCard title="Personal">
                    <SettingsRow
                        icon={ProfileIcon}
                        title="Personal Details"
                        subtitle={isComplete ? null : 'Tap to finish setting up'}
                        value={detailsSummary}
                        onPress={() => navigation.navigate('EditProfile')}
                        last
                    />
                </SectionCard>

                {/* Account section */}
                <SectionCard title="Account">
                    <SettingsRow
                        icon={LogoutIcon}
                        title="Sign Out"
                        destructive
                        last
                        onPress={handleSignOut}
                    />
                </SectionCard>
            </ScrollView>
        </SafeAreaView>
    );
};

const createStyles = (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    content: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },
    header: {
        marginBottom: theme.spacing.xl,
    },
    title: {
        fontSize: theme.fontSize.xxxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    email: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    identityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.md + 2,
        marginBottom: theme.spacing.xl,
        ...theme.shadows.sm,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: theme.borderRadius.full,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: theme.spacing.md - 2,
    },
    avatarText: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    identityInfo: {
        flex: 1,
    },
    identityName: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: 3,
    },
    identityPrompt: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textTertiary,
    },
    bmiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
    },
    bmiDot: {
        width: 7,
        height: 7,
        borderRadius: theme.borderRadius.full,
    },
    bmiText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
    },
});
