import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
    Keyboard,
    Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemedStyles } from '../../styles/useThemedStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { chatWithNutritionist } from '../../../logic/services/api/geminiService';
import { getProfile } from '../../../logic/services/api/profileService';
import { SendIcon } from '../../components/icons';

const GREETING = {
    id: 'greeting',
    role: 'model',
    text: "Hi, I'm Kyra 🌿 — your personal health companion.\n\nAsk me anything: meal ideas, protein tips, or how to hit today's targets.",
};

const keyboardOverlap = (e) => {
    const windowHeight = Dimensions.get('window').height;
    const { height, screenY } = e.endCoordinates;
    const fromScreen = Math.max(0, windowHeight - screenY);
    return Math.max(height || 0, fromScreen);
};

export const ChatScreen = () => {
    const { theme, styles } = useThemedStyles(createStyles);
    const { user } = useAuth();
    const [messages, setMessages] = useState([GREETING]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const listRef = useRef(null);

    useEffect(() => {
        const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
        const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
        const changeEvent = Platform.OS === 'ios' ? 'keyboardWillChangeFrame' : 'keyboardDidShow';

        const onShow = (e) => setKeyboardHeight(keyboardOverlap(e));
        const onHide = () => setKeyboardHeight(0);

        const show = Keyboard.addListener(showEvent, onShow);
        const hide = Keyboard.addListener(hideEvent, onHide);
        const change = Keyboard.addListener(changeEvent, (e) => {
            const next = keyboardOverlap(e);
            setKeyboardHeight(next > 80 ? next : 0);
        });

        return () => {
            show.remove();
            hide.remove();
            change.remove();
        };
    }, []);

    useEffect(() => {
        const id = setTimeout(() => {
            listRef.current?.scrollToEnd({ animated: true });
        }, 50);
        return () => clearTimeout(id);
    }, [messages, keyboardHeight]);

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
        <SafeAreaView style={styles.safeArea} edges={['left', 'right']}>
            <View style={[styles.container, { paddingBottom: keyboardHeight }]}>
                <FlatList
                    ref={listRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.messageList}
                    onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
                    keyboardShouldPersistTaps="handled"
                    keyboardDismissMode="interactive"
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
            </View>
        </SafeAreaView>
    );
};

const createStyles = (theme) => ({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    messageList: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        gap: theme.spacing.sm,
        flexGrow: 1,
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
        paddingBottom: theme.spacing.sm,
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
