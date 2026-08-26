import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
} from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { theme, getMealTypeColor } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { useAuth } from '../../../logic/contexts/AuthContext';
import { analyzeFoodImage } from '../../../logic/services/api/geminiService';
import { saveMeal } from '../../../logic/services/storageService';
import { useModal, AnalysisLoader } from '../../components';
import {
    CameraIcon,
    ImageIcon,
    CloseIcon,
    SparklesIcon,
    EditIcon,
} from '../../components/icons';
import { getMacroSuggestions } from '../../../logic/utils/macroGoals';
import { getProfile } from '../../../logic/services/api/profileService';
import { getTodaysMeals } from '../../../logic/services/storageService';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'];

export const AddMealScreen = ({ navigation, route }) => {
    const { showAlert } = useModal();
    const { user } = useAuth();

    const [selectedMealType, setSelectedMealType] = useState(route.params?.mealType || 'breakfast');
    const [imageUri, setImageUri] = useState(null);
    const [stage, setStage] = useState('capture');
    const [saving, setSaving] = useState(false);

    const [result, setResult] = useState(null);
    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [description, setDescription] = useState('');
    const [itemsText, setItemsText] = useState('');

    const [targets, setTargets] = useState(null);
    const [eatenToday, setEatenToday] = useState({ calories: 0, protein: 0 });

    useEffect(() => {
        loadContext();
    }, []);

    const loadContext = async () => {
        try {
            const [{ data: profile }, meals] = await Promise.all([
                getProfile(user.id),
                getTodaysMeals(),
            ]);
            if (profile) {
                setTargets(getMacroSuggestions(profile));
            }
            setEatenToday({
                calories: meals.reduce((s, m) => s + (m.calories || 0), 0),
                protein: meals.reduce((s, m) => s + (m.protein || 0), 0),
            });
        } catch (error) {
            console.error('Error loading context:', error);
        }
    };

    const pickImage = async (fromCamera) => {
        try {
            const options = {
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                exif: false,
            };

            const pickerResult = fromCamera
                ? await ImagePicker.launchCameraAsync(options)
                : await ImagePicker.launchImageLibraryAsync(options);

            if (!pickerResult.canceled && pickerResult.assets?.length > 0) {
                const uri = pickerResult.assets[0].uri;
                setImageUri(uri);
                startAnalysis(uri);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            showAlert('Oops!', 'Could not get the photo. Please try again.');
        }
    };

    const startAnalysis = async (uri) => {
        setStage('analyzing');
        try {
            const analysisResult = await analyzeFoodImage(uri);
            setResult(analysisResult);
            setCalories(String(analysisResult.calories || ''));
            setProtein(analysisResult.protein ? String(Math.round(analysisResult.protein)) : '');
            setCarbs(analysisResult.carbs ? String(Math.round(analysisResult.carbs)) : '');
            setFat(analysisResult.fat ? String(Math.round(analysisResult.fat)) : '');
            setDescription(analysisResult.description || '');
            setItemsText((analysisResult.items || []).join(', '));
            setStage('review');
        } catch (error) {
            console.error('Error analyzing image:', error);
            showAlert(
                'Analysis Failed',
                'Could not analyze this photo. Try a clearer picture of your food.',
                [
                    { text: 'Try Again', style: 'primary', onPress: () => setStage('capture') },
                ]
            );
            setStage('capture');
        }
    };

    const retakePhoto = () => {
        setImageUri(null);
        setResult(null);
        setStage('capture');
    };

    const numeric = (v) => {
        const n = parseFloat(v);
        return isNaN(n) ? null : n;
    };

    const saveMealEntry = async () => {
        const cal = numeric(calories);
        if (cal === null) {
            showAlert('Missing Calories', 'Enter the calorie estimate before saving.');
            return;
        }

        setSaving(true);
        try {
            await saveMeal({
                mealType: selectedMealType,
                calories: Math.round(cal),
                description: description.trim() || 'Food items detected',
                items: itemsText
                    .split(',')
                    .map((i) => i.trim())
                    .filter(Boolean),
                protein: numeric(protein),
                carbs: numeric(carbs),
                fat: numeric(fat),
            });
            showAlert('🎉 Meal Logged!', 'Your meal has been saved successfully.', [
                { text: 'Done', style: 'primary', onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            console.error('Error saving meal:', error);
            showAlert('Oops!', 'Failed to save meal. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // ---------------- Capture stage ----------------
    if (stage === 'capture') {
        return (
            <SafeAreaView style={globalStyles.safeArea}>
                <View style={styles.captureContainer}>
                    <TouchableOpacity style={styles.closeButton} onPress={() => navigation.goBack()}>
                        <CloseIcon size={15} color={theme.colors.textSecondary} strokeWidth={2.2} />
                    </TouchableOpacity>

                    <View style={styles.captureHero}>
                        <View style={[styles.heroCircle, styles.heroCircleRing]}>
                            <CameraIcon size={46} color={theme.colors.primary} strokeWidth={1.5} />
                        </View>
                        <Text style={styles.captureTitle}>Snap your meal</Text>
                        <Text style={styles.captureSubtitle}>
                            Take a photo and AI will estimate the calories and macros for you.
                        </Text>
                    </View>

                    <View style={styles.captureActions}>
                        <TouchableOpacity style={styles.primaryAction} activeOpacity={0.85} onPress={() => pickImage(true)}>
                            <CameraIcon size={19} color={theme.colors.white} strokeWidth={2} />
                            <Text style={styles.primaryActionText}>Open Camera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.secondaryAction} onPress={() => pickImage(false)}>
                            <ImageIcon size={18} color={theme.colors.text} strokeWidth={2} />
                            <Text style={styles.secondaryActionText}>Choose from Gallery</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Meal type selection available upfront */}
                    <View style={styles.typeRow}>
                        {MEAL_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeChip,
                                    selectedMealType === type && { backgroundColor: getMealTypeColor(type), borderColor: getMealTypeColor(type) },
                                ]}
                                onPress={() => setSelectedMealType(type)}
                            >
                                <Text
                                    style={[
                                        styles.typeChipText,
                                        selectedMealType === type && styles.typeChipTextActive,
                                    ]}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    // ---------------- Analyzing stage ----------------
    if (stage === 'analyzing') {
        return (
            <SafeAreaView style={globalStyles.safeArea}>
                <View style={styles.analyzingContainer}>
                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.analyzingPreview} contentFit="cover" />
                    )}
                    <AnalysisLoader size={150} label="Reading your plate…" />
                    <Text style={styles.analyzingHint}>
                        Estimating calories, protein, carbs and fat with AI
                    </Text>
                </View>
            </SafeAreaView>
        );
    }

    // ---------------- Review stage ----------------
    const remainingProtein = targets ? Math.max(targets.protein - eatenToday.protein - (numeric(protein) || 0), 0) : null;

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <KeyboardAvoidingView
                style={styles.flex1}
                behavior="padding"
            >
                <ScrollView
                    style={styles.container}
                    contentContainerStyle={styles.reviewContent}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Header */}
                    <View style={styles.reviewHeader}>
                        <Text style={styles.reviewTitle}>Review your meal</Text>
                        <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
                            <EditIcon size={13} color={theme.colors.primary} strokeWidth={2.2} />
                            <Text style={styles.retakeText}>Edit photo</Text>
                        </TouchableOpacity>
                    </View>

                    {imageUri && (
                        <Image source={{ uri: imageUri }} style={styles.previewImage} contentFit="cover" />
                    )}

                    {/* AI suggestion strip */}
                    {targets && remainingProtein !== null && (
                        <View style={styles.suggestionStrip}>
                            <SparklesIcon size={16} color={theme.colors.primary} strokeWidth={2} />
                            <Text style={styles.suggestionStripText}>
                                After this meal you'll be at{' '}
                                <Text style={styles.suggestionStripStrong}>{eatenToday.calories + (numeric(calories) || 0)}</Text>
                                /{targets.calorieGoal} cal
                                {remainingProtein > 0
                                    ? ` · still ${Math.round(remainingProtein)}g protein short of your ${targets.protein}g target`
                                    : ' · protein target hit 🎉'}
                            </Text>
                        </View>
                    )}

                    {/* Editable macros */}
                    <Text style={styles.sectionLabel}>Detected by AI — tap to edit</Text>
                    <View style={styles.macroGrid}>
                        <MacroInput label="Calories" value={calories} onChange={setCalories} color={theme.colors.primary} />
                        <MacroInput label="Protein (g)" value={protein} onChange={setProtein} color={theme.colors.lunch} />
                        <MacroInput label="Carbs (g)" value={carbs} onChange={setCarbs} color={theme.colors.amber} />
                        <MacroInput label="Fat (g)" value={fat} onChange={setFat} color={theme.colors.error} />
                    </View>

                    {/* Description */}
                    <Text style={styles.sectionLabel}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={description}
                        onChangeText={setDescription}
                        placeholder="What did you eat?"
                        placeholderTextColor={theme.colors.textLight}
                        multiline
                    />

                    {/* Items */}
                    <Text style={styles.sectionLabel}>Items (comma separated)</Text>
                    <TextInput
                        style={styles.input}
                        value={itemsText}
                        onChangeText={setItemsText}
                        placeholder="rice, chicken, salad"
                        placeholderTextColor={theme.colors.textLight}
                    />

                    {/* Meal type */}
                    <Text style={styles.sectionLabel}>Meal type</Text>
                    <View style={styles.typeRowReview}>
                        {MEAL_TYPES.map((type) => (
                            <TouchableOpacity
                                key={type}
                                style={[
                                    styles.typeChipSmall,
                                    selectedMealType === type && { backgroundColor: getMealTypeColor(type), borderColor: getMealTypeColor(type) },
                                ]}
                                onPress={() => setSelectedMealType(type)}
                            >
                                <Text
                                    style={[
                                        styles.typeChipText,
                                        selectedMealType === type && styles.typeChipTextActive,
                                    ]}
                                >
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[globalStyles.button, styles.saveButton, saving && styles.buttonDisabled]}
                        onPress={saveMealEntry}
                        disabled={saving}
                    >
                        <Text style={globalStyles.buttonText}>{saving ? 'Saving…' : 'Save Meal'}</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const MacroInput = ({ label, value, onChange, color }) => (
    <View style={styles.macroInputCard}>
        <View style={[styles.macroInputDot, { backgroundColor: color }]} />
        <Text style={styles.macroInputLabel}>{label}</Text>
        <TextInput
            style={styles.macroInputField}
            value={value}
            onChangeText={(t) => onChange(t.replace(/[^0-9]/g, ''))}
            keyboardType="number-pad"
            placeholder="0"
            placeholderTextColor={theme.colors.textLight}
        />
    </View>
);

const styles = StyleSheet.create({
    flex1: { flex: 1 },

    // Capture
    captureContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        padding: theme.spacing.lg,
    },
    closeButton: {
        alignSelf: 'flex-end',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.backgroundSecondary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    captureHero: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    heroCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: theme.colors.primarySoft,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
    },
    heroCircleRing: {
        borderWidth: 1.5,
        borderColor: `${theme.colors.primary}30`,
    },
    captureTitle: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        textAlign: 'center',
    },
    captureSubtitle: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.sm,
        lineHeight: 22,
        paddingHorizontal: theme.spacing.md,
    },
    captureActions: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    primaryAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        gap: theme.spacing.sm,
        ...theme.shadows.md,
    },
    primaryActionText: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.white,
    },
    secondaryAction: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingVertical: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        gap: theme.spacing.sm,
    },
    secondaryActionText: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
    },
    typeRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: theme.spacing.sm,
    },
    typeChip: {
        paddingVertical: 8,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    typeChipText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
    },
    typeChipTextActive: {
        color: theme.colors.white,
    },

    // Analyzing
    analyzingContainer: {
        flex: 1,
        backgroundColor: theme.colors.background,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    analyzingPreview: {
        width: '100%',
        height: 220,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.lg,
    },
    analyzingHint: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textTertiary,
        marginTop: theme.spacing.sm,
        textAlign: 'center',
    },

    // Review
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    reviewContent: {
        padding: theme.spacing.lg,
        paddingBottom: theme.spacing.xxl,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.md,
    },
    reviewTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    retakeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: theme.colors.primarySoft,
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: 6,
        borderRadius: theme.borderRadius.full,
    },
    retakeText: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.primary,
    },
    previewImage: {
        width: '100%',
        height: 180,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.md,
    },
    suggestionStrip: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: theme.spacing.sm,
        backgroundColor: theme.colors.primarySoft,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md - 2,
        marginBottom: theme.spacing.md,
    },
    suggestionStripText: {
        flex: 1,
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        lineHeight: 19,
    },
    suggestionStripStrong: {
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    sectionLabel: {
        fontSize: theme.fontSize.sm,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    macroGrid: {
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    macroInputCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        height: 52,
    },
    macroInputDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: theme.spacing.sm,
    },
    macroInputLabel: {
        flex: 1,
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.medium,
        color: theme.colors.textSecondary,
    },
    macroInputField: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        minWidth: 90,
        textAlign: 'right',
    },
    input: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm + 2,
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    textArea: {
        minHeight: 70,
        paddingTop: theme.spacing.sm + 2,
        textAlignVertical: 'top',
    },
    typeRowReview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: theme.spacing.sm,
        marginBottom: theme.spacing.lg,
    },
    typeChipSmall: {
        paddingVertical: 8,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.borderRadius.full,
        borderWidth: 1,
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.backgroundSecondary,
    },
    saveButton: {
        marginTop: theme.spacing.sm,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
});
