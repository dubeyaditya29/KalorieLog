import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import { useHeaderHeight } from '@react-navigation/elements';
import { theme } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { chatWithNutritionist } from '../../../logic/services/api/geminiService';
import { getProfile } from '../../../logic/services/api/profileService';
import { ChatIcon, SendIcon } from '../../components/icons';

const GREETING = {
    id: 'greeting',
    role: 'model',
    text: "Hi, I'm Kyra 🌿 — your personal health companion.\n\nAsk me anything: meal ideas, protein tips, or how to hit today's targets.",
};

export const ChatScreen = () => {
    const { user } = useAuth();
    const headerHeight = useHeaderHeight();
    const [messages, setMessages] = useState([GREETING]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const listRef = useRef(null);

    useEffect(() => {
        setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const sendMessage = async () => {
        const text = input.trim();
        if (!text || sending) return;

        setInput('');
        setSending(true);

        const userMessage = { id: `u-${Date.now()}`, role: 'user', text };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const { data: profile } = await getProfile(user.id);
            const history = [...messages, userMessage].map(({ role, text }) => ({ role, text }));

            const { text: reply, error } = await chatWithNutritionist(history, profile);

            if (error) throw error;

            setMessages((prev) => [
                ...prev,
                { id: `m-${Date.now()}`, role: 'model', text: reply },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    id: `e-${Date.now()}`,
                    role: 'model',
                    text: 'Sorry, I could not respond right now. Please try again.',
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior="padding"
                keyboardVerticalOffset={Platform.OS === 'ios' ? headerHeight : 0}
            >
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                    keyboardShouldPersistTaps="handled"
                    renderItem={({ item }) => (
                        <View
                            style={[
                                styles.bubble,
                                item.role === 'user' ? styles.bubbleUser : styles.bubbleModel,
                            ]}
                        >
                            <Text style={[styles.bubbleText, item.role === 'user' && styles.bubbleTextUser]}>
                                {item.text}
                            </Text>
                        </View>
                    )}
                />

                {sending && (
                    <View style={styles.typingRow}>
                        <View style={[styles.bubble, styles.bubbleModel, styles.typingBubble]}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                        </View>
                    </View>
                )}

                <View style={styles.inputRow}>
                    <TextInput
                        style={styles.input}
                        value={input}
                        onChangeText={setInput}
                        placeholder="Ask about nutrition…"
                        placeholderTextColor={theme.colors.textLight}
                        multiline
                        maxLength={1000}
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, (!input.trim() || sending) && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={!input.trim() || sending}
                    >
                        <SendIcon size={17} color={theme.colors.white} strokeWidth={2.2} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    messageList: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
    },
    bubble: {
        maxWidth: '80%',
        borderRadius: theme.borderRadius.lg,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
    },
    bubbleUser: {
        alignSelf: 'flex-end',
        backgroundColor: theme.colors.primary,
        borderBottomRightRadius: 4,
    },
    bubbleModel: {
        alignSelf: 'flex-start',
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: theme.colors.borderLight,
        borderBottomLeftRadius: 4,
    },
    bubbleText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        lineHeight: 21,
    },
    bubbleTextUser: {
        color: theme.colors.white,
    },
    typingRow: {
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing.xs,
    },
    typingBubble: {
        paddingVertical: theme.spacing.sm + 2,
    },
    inputRow: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: theme.spacing.md,
        paddingTop: theme.spacing.sm,
        paddingBottom: theme.spacing.md,
        gap: theme.spacing.sm,
        borderTopWidth: 1,
        borderTopColor: theme.colors.borderLight,
        backgroundColor: theme.colors.background,
    },
    input: {
        flex: 1,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.xl,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: theme.spacing.md,
        paddingTop: Platform.OS === 'ios' ? 10 : 12,
        paddingBottom: 10,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        maxHeight: 110,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 1,
    },
    sendButtonDisabled: {
        opacity: 0.4,
    },
});
