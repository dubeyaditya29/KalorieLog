import React, { useState, useCallback, createContext, useContext } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    Animated,
} from 'react-native';
import { theme } from '../../styles/theme';

/**
 * Themed Modal Component
 * A dark-themed modal that matches the app's design language
 */
export const ThemedModal = ({ visible, title, message, buttons = [], onClose }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {title && <Text style={styles.title}>{title}</Text>}
                    {message && <Text style={styles.message}>{message}</Text>}
                    <View style={styles.buttonContainer}>
                        {buttons.map((button, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.button,
                                    button.style === 'primary' && styles.buttonPrimary,
                                    button.style === 'destructive' && styles.buttonDestructive,
                                    button.style === 'cancel' && styles.buttonCancel,
                                ]}
                                onPress={() => {
                                    onClose();
                                    button.onPress?.();
                                }}
                            >
                                <Text style={[
                                    styles.buttonText,
                                    button.style === 'primary' && styles.buttonTextPrimary,
                                    button.style === 'destructive' && styles.buttonTextDestructive,
                                ]}>
                                    {button.text}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </Modal>
    );
};

/**
 * Modal Context for global modal access
 */
const ModalContext = createContext(null);

/**
 * Modal Provider - Wrap your app with this to use useModal hook anywhere
 */
export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        visible: false,
        title: '',
        message: '',
        buttons: [],
    });

    const showModal = useCallback((title, message, buttons = [{ text: 'OK', style: 'primary' }]) => {
        setModalState({
            visible: true,
            title,
            message,
            buttons,
        });
    }, []);

    const hideModal = useCallback(() => {
        setModalState(prev => ({ ...prev, visible: false }));
    }, []);

    // Convenience methods
    // showAlert can accept either a callback (onOk) or an array of buttons
    const showAlert = useCallback((title, message, buttonsOrCallback) => {
        if (Array.isArray(buttonsOrCallback)) {
            // If buttons array is passed, use it directly
            showModal(title, message, buttonsOrCallback);
        } else {
            // If callback is passed, create default OK button
            showModal(title, message, [
                { text: 'OK', style: 'primary', onPress: buttonsOrCallback },
            ]);
        }
    }, [showModal]);

    const showConfirm = useCallback((title, message, onConfirm, onCancel) => {
        showModal(title, message, [
            { text: 'Cancel', style: 'cancel', onPress: onCancel },
            { text: 'Confirm', style: 'primary', onPress: onConfirm },
        ]);
    }, [showModal]);

    const showDestructive = useCallback((title, message, destructiveText, onDestructive, onCancel) => {
        showModal(title, message, [
            { text: 'Cancel', style: 'cancel', onPress: onCancel },
            { text: destructiveText, style: 'destructive', onPress: onDestructive },
        ]);
    }, [showModal]);

    const value = {
        showModal,
        hideModal,
        showAlert,
        showConfirm,
        showDestructive,
    };

    return (
        <ModalContext.Provider value={value}>
            {children}
            <ThemedModal
                visible={modalState.visible}
                title={modalState.title}
                message={modalState.message}
                buttons={modalState.buttons}
                onClose={hideModal}
            />
        </ModalContext.Provider>
    );
};

/**
 * Hook to use themed modals anywhere in the app
 * 
 * Usage:
 * const { showAlert, showConfirm, showDestructive } = useModal();
 * 
 * showAlert('Title', 'Message');
 * showConfirm('Title', 'Are you sure?', () => console.log('confirmed'));
 * showDestructive('Delete', 'Are you sure?', 'Delete', () => handleDelete());
 */
export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
    },
    container: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        width: '100%',
        maxWidth: 320,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    title: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    message: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: theme.spacing.xl,
    },
    buttonContainer: {
        flexDirection: 'column',
        gap: theme.spacing.sm,
    },
    button: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundTertiary,
        alignItems: 'center',
    },
    buttonPrimary: {
        backgroundColor: theme.colors.primary,
    },
    buttonDestructive: {
        backgroundColor: theme.colors.error,
    },
    buttonCancel: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    buttonText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
    },
    buttonTextPrimary: {
        color: theme.colors.white,
    },
    buttonTextDestructive: {
        color: theme.colors.white,
    },
});
