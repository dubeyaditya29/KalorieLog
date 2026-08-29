import React, { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../styles/useThemedStyles';

export const PWA_INSTALL_KEY = '@kyra_pwa_install_done';

const isStandaloneDisplay = () => {
    if (typeof window === 'undefined') return false;
    const standalone = window.matchMedia?.('(display-mode: standalone)')?.matches;
    return Boolean(standalone || window.navigator?.standalone);
};

const isIosWeb = () => {
    if (typeof navigator === 'undefined') return false;
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
};

export const InstallPrompt = () => {
    const { theme, styles } = useThemedStyles(createStyles);
    const insets = useSafeAreaInsets();
    const [visible, setVisible] = useState(false);
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    useEffect(() => {
        if (Platform.OS !== 'web') return undefined;

        let cancelled = false;

        const hideForever = () => {
            AsyncStorage.setItem(PWA_INSTALL_KEY, 'true').catch(() => {});
            if (!cancelled) setVisible(false);
        };

        if (isStandaloneDisplay()) {
            hideForever();
            return undefined;
        }

        const revealIfNeeded = () => {
            AsyncStorage.getItem(PWA_INSTALL_KEY)
                .then((value) => {
                    if (!cancelled && value !== 'true' && !isStandaloneDisplay()) {
                        setVisible(true);
                    }
                })
                .catch(() => {});
        };

        revealIfNeeded();
        const fallback = setTimeout(revealIfNeeded, 1200);

        const onBeforeInstall = (event) => {
            event.preventDefault();
            setDeferredPrompt(event);
            revealIfNeeded();
        };

        const onInstalled = () => hideForever();

        window.addEventListener('beforeinstallprompt', onBeforeInstall);
        window.addEventListener('appinstalled', onInstalled);

        return () => {
            cancelled = true;
            clearTimeout(fallback);
            window.removeEventListener('beforeinstallprompt', onBeforeInstall);
            window.removeEventListener('appinstalled', onInstalled);
        };
    }, []);

    const markDone = () => {
        setVisible(false);
        setDeferredPrompt(null);
        AsyncStorage.setItem(PWA_INSTALL_KEY, 'true').catch(() => {});
    };

    const handleAdd = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const choice = await deferredPrompt.userChoice.catch(() => null);
            if (choice?.outcome === 'accepted') {
                markDone();
                return;
            }
            setDeferredPrompt(null);
            return;
        }
        markDone();
    };

    if (Platform.OS !== 'web' || !visible) return null;

    const iosCopy = isIosWeb() && !deferredPrompt;

    return (
        <View
            style={[
                styles.wrap,
                {
                    bottom: Math.max(insets.bottom, 12) + 12,
                    backgroundColor: theme.colors.background,
                    borderColor: theme.colors.border,
                    shadowColor: theme.colors.black,
                },
            ]}
        >
            <Text style={styles.title}>Add Kyra to your home screen</Text>
            <Text style={styles.body}>
                {iosCopy
                    ? 'Tap Share, then Add to Home Screen. When that’s done, tap Added.'
                    : 'Install Kyra for quicker access, like an app.'}
            </Text>
            <View style={styles.row}>
                <TouchableOpacity onPress={markDone} style={styles.secondaryBtn} accessibilityRole="button">
                    <Text style={styles.secondaryText}>Not now</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleAdd} style={styles.primaryBtn} accessibilityRole="button">
                    <Text style={styles.primaryText}>{iosCopy ? 'Added' : 'Add shortcut'}</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const createStyles = (theme) => ({
    wrap: {
        position: 'absolute',
        left: 16,
        right: 16,
        zIndex: 50,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 1,
        padding: theme.spacing.md,
        shadowOpacity: 0.12,
        shadowRadius: 16,
        shadowOffset: { width: 0, height: 8 },
        elevation: 8,
    },
    title: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.xs,
    },
    body: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        lineHeight: 20,
        marginBottom: theme.spacing.md,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    secondaryBtn: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    secondaryText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    primaryBtn: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    primaryText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.white,
    },
});
