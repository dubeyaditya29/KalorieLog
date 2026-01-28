import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Image as RNImage,
} from 'react-native';
import { Image } from 'expo-image';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { theme, getMealTypeColor } from '../../styles/theme';
import { globalStyles } from '../../styles/globalStyles';
import { analyzeFoodImage } from '../../../logic/services/api/geminiService';
import { saveMeal } from '../../../logic/services/storageService';
import { useModal } from '../../components/common/ThemedModal';
import { mealTypeIcons, cameraIcon, galleryIcon, analyzeIcon } from '../../assets';

export const AddMealScreen = ({ navigation, route }) => {
    const { showAlert } = useModal();
    const [selectedMealType, setSelectedMealType] = useState(
        route.params?.mealType || 'breakfast'
    );
    const [imageUri, setImageUri] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);
    const scrollViewRef = useRef(null);

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    // Debug log when imageUri changes
    useEffect(() => {
        if (imageUri) {
            console.log('Image URI set to:', imageUri);
        }
    }, [imageUri]);

    const takePhoto = async () => {
        try {
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                exif: false,
            });

            console.log('Camera result:', result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                console.log('Setting image URI:', uri);
                setImageUri(uri);
                setResult(null);
            }
        } catch (error) {
            console.error('Error taking photo:', error);
            showAlert('Oops!', 'Failed to take photo. Please try again.');
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.5,
                exif: false,
            });

            console.log('Gallery result:', result);

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const uri = result.assets[0].uri;
                console.log('Setting image URI:', uri);
                setImageUri(uri);
                setResult(null);
            }
        } catch (error) {
            console.error('Error picking image:', error);
            showAlert('Oops!', 'Failed to pick image. Please try again.');
        }
    };

    const analyzeImage = async () => {
        if (!imageUri) {
            showAlert('No Image', 'Please take a photo or select an image first.');
            return;
        }

        setAnalyzing(true);
        try {
            const analysisResult = await analyzeFoodImage(imageUri);
            setResult(analysisResult);
            // Scroll to bottom to show results
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({ animated: true });
            }, 100);
        } catch (error) {
            console.error('Error analyzing image:', error);
            showAlert(
                'Analysis Failed',
                'Could not analyze the image. Please try again with a clearer photo of your food.'
            );
        } finally {
            setAnalyzing(false);
        }
    };

    const saveMealEntry = async () => {
        if (!result) {
            showAlert('No Analysis', 'Please analyze the image first.');
            return;
        }

        try {
            await saveMeal({
                mealType: selectedMealType,
                calories: result.calories,
                description: result.description,
                items: result.items,
                protein: result.protein,
                carbs: result.carbs,
                fat: result.fat,
            });

            showAlert('🎉 Meal Logged!', 'Your meal has been saved successfully.', [
                {
                    text: 'OK',
                    style: 'primary',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Error saving meal:', error);
            showAlert('Oops!', 'Failed to save meal. Please try again.');
        }
    };

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView ref={scrollViewRef} style={styles.container} contentContainerStyle={styles.contentContainer}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.backButton}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Add Meal</Text>
                        <View style={{ width: 60 }} />
                    </View>

                    {/* Meal Type Selector */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Meal Type</Text>
                        <View style={styles.mealTypeSelector}>
                            {mealTypes.map((type) => {
                                const isSelected = selectedMealType === type;
                                const color = getMealTypeColor(type);
                                const icon = mealTypeIcons[type];

                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.mealTypeButton,
                                            isSelected && {
                                                borderColor: '#FFFFFF',
                                            },
                                        ]}
                                        onPress={() => setSelectedMealType(type)}
                                    >
                                        <RNImage
                                            source={icon}
                                            style={styles.mealTypeIcon}
                                        />
                                        <Text style={styles.mealTypeText}>
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Image Selection */}
                    <View style={styles.section}>
                        {imageUri ? (
                            <View style={styles.imageContainer}>
                                <Image
                                    key={imageUri}
                                    source={imageUri}
                                    style={styles.image}
                                    contentFit="cover"
                                    transition={200}
                                />
                                <TouchableOpacity
                                    style={styles.removeImageButton}
                                    onPress={() => {
                                        setImageUri(null);
                                        setResult(null);
                                    }}
                                >
                                    <Text style={styles.removeImageText}>✕</Text>
                                </TouchableOpacity>
                            </View>
                        ) : null}

                        <View style={styles.imageButtons}>
                            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                                <RNImage
                                    source={cameraIcon}
                                    style={styles.imageButtonIcon}
                                />
                                <Text style={styles.imageButtonText}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                                <RNImage
                                    source={galleryIcon}
                                    style={styles.imageButtonIcon}
                                />
                                <Text style={styles.imageButtonText}>Choose from Gallery</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Analyze Button */}
                    {imageUri && !result && (
                        <TouchableOpacity
                            style={[globalStyles.button, styles.analyzeButton]}
                            onPress={analyzeImage}
                            disabled={analyzing}
                        >
                            <View style={styles.analyzeButtonContent}>
                                <RNImage
                                    source={analyzeIcon}
                                    style={styles.analyzeButtonIcon}
                                />
                                <Text style={globalStyles.buttonText}>
                                    {analyzing ? 'Analyzing...' : 'Analyze Food'}
                                </Text>
                                {analyzing && (
                                    <ActivityIndicator
                                        color={theme.colors.white}
                                        size="small"
                                        style={{ marginLeft: theme.spacing.sm }}
                                    />
                                )}
                            </View>
                        </TouchableOpacity>
                    )}

                    {/* Analysis Result */}
                    {result && (
                        <View style={styles.resultContainer}>
                            <Text style={styles.resultTitle}>Analysis Result</Text>

                            <View style={styles.caloriesResult}>
                                <Text style={styles.caloriesNumber}>{result.calories}</Text>
                                <Text style={styles.caloriesLabel}>calories</Text>
                            </View>

                            <Text style={styles.resultDescription}>{result.description}</Text>

                            {/* Macronutrients */}
                            <View style={styles.macrosContainer}>
                                <View style={styles.macroItem}>
                                    <Text style={[styles.macroValue, { color: '#0A84FF' }]}>
                                        {result.protein || 0}g
                                    </Text>
                                    <Text style={styles.macroLabel}>Protein</Text>
                                </View>
                                <View style={styles.macroItem}>
                                    <Text style={[styles.macroValue, { color: '#FFD60A' }]}>
                                        {result.carbs || 0}g
                                    </Text>
                                    <Text style={styles.macroLabel}>Carbs</Text>
                                </View>
                                <View style={styles.macroItem}>
                                    <Text style={[styles.macroValue, { color: '#FF453A' }]}>
                                        {result.fat || 0}g
                                    </Text>
                                    <Text style={styles.macroLabel}>Fat</Text>
                                </View>
                            </View>

                            {result.items && result.items.length > 0 && (
                                <View style={styles.itemsList}>
                                    <Text style={styles.itemsTitle}>Detected Items:</Text>
                                    {result.items.map((item, index) => (
                                        <View key={index} style={styles.itemRow}>
                                            <Text style={styles.itemBullet}>•</Text>
                                            <Text style={styles.itemText}>{item}</Text>
                                        </View>
                                    ))}
                                </View>
                            )}

                            <TouchableOpacity
                                style={[globalStyles.button, styles.saveButton]}
                                onPress={saveMealEntry}
                            >
                                <Text style={globalStyles.buttonText}>Save Meal ✓</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={globalStyles.buttonSecondary}
                                onPress={() => {
                                    setImageUri(null);
                                    setResult(null);
                                }}
                            >
                                <Text style={globalStyles.buttonSecondaryText}>Try Another Photo</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    contentContainer: {
        padding: theme.spacing.lg,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.xl,
    },
    backButton: {
        fontSize: theme.fontSize.md,
        color: theme.colors.primary,
        fontWeight: theme.fontWeight.semibold,
    },
    title: {
        fontSize: theme.fontSize.xxl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
    },
    section: {
        marginBottom: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
    },
    mealTypeSelector: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    mealTypeButton: {
        flex: 1,
        padding: theme.spacing.md,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundSecondary,
        borderWidth: 2,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    mealTypeIcon: {
        width: 28,
        height: 28,
        marginBottom: theme.spacing.xs,
        tintColor: '#FFFFFF',
    },
    mealTypeText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        fontWeight: theme.fontWeight.medium,
    },
    mealTypeTextSelected: {
        color: theme.colors.white,
    },
    imageContainer: {
        width: '100%',
        height: 300,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        marginBottom: theme.spacing.md,
        backgroundColor: theme.colors.backgroundTertiary,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    removeImageButton: {
        position: 'absolute',
        top: theme.spacing.sm,
        right: theme.spacing.sm,
        backgroundColor: theme.colors.error,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    removeImageText: {
        color: theme.colors.white,
        fontSize: theme.fontSize.lg,
        fontWeight: theme.fontWeight.bold,
    },
    imagePlaceholder: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: theme.colors.border,
        borderStyle: 'dashed',
        marginBottom: theme.spacing.md,
    },
    imagePlaceholderIcon: {
        fontSize: 64,
        marginBottom: theme.spacing.md,
    },
    imagePlaceholderText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    imageButtons: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
    },
    imageButton: {
        flex: 1,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    imageButtonIcon: {
        width: 32,
        height: 32,
        marginBottom: theme.spacing.xs,
        tintColor: '#FFFFFF',
    },
    imageButtonText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        fontWeight: theme.fontWeight.medium,
    },
    analyzeButton: {
        marginBottom: theme.spacing.lg,
    },
    analyzeButtonContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    analyzeButtonIcon: {
        width: 24,
        height: 24,
        tintColor: '#FFFFFF',
    },
    resultContainer: {
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.lg,
        ...theme.shadows.md,
    },
    resultTitle: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.text,
        marginBottom: theme.spacing.md,
        textAlign: 'center',
    },
    caloriesResult: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingVertical: theme.spacing.lg,
        backgroundColor: theme.colors.backgroundSecondary,
        borderRadius: theme.borderRadius.md,
    },
    caloriesNumber: {
        fontSize: 48,
        fontWeight: theme.fontWeight.bold,
        color: theme.colors.primary,
    },
    caloriesLabel: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
    },
    resultDescription: {
        fontSize: theme.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
        textAlign: 'center',
        lineHeight: 22,
    },
    macrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: theme.colors.backgroundTertiary,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        marginBottom: theme.spacing.lg,
    },
    macroItem: {
        alignItems: 'center',
    },
    macroValue: {
        fontSize: theme.fontSize.xl,
        fontWeight: theme.fontWeight.bold,
    },
    macroLabel: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.textSecondary,
        marginTop: theme.spacing.xs,
    },
    itemsList: {
        marginBottom: theme.spacing.lg,
    },
    itemsTitle: {
        fontSize: theme.fontSize.md,
        fontWeight: theme.fontWeight.semibold,
        color: theme.colors.text,
        marginBottom: theme.spacing.sm,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: theme.spacing.xs,
    },
    itemBullet: {
        fontSize: theme.fontSize.md,
        color: theme.colors.primary,
        marginRight: theme.spacing.sm,
    },
    itemText: {
        fontSize: theme.fontSize.md,
        color: theme.colors.text,
        flex: 1,
    },
    saveButton: {
        marginBottom: theme.spacing.sm,
    },
});
