import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { theme, getMealTypeColor, getMealTypeIcon } from '../styles/theme';
import { globalStyles } from '../styles/globalStyles';
import { analyzeFoodImage } from '../services/geminiService';
import { saveMeal } from '../services/storageService';

export const AddMealScreen = ({ navigation, route }) => {
    const [selectedMealType, setSelectedMealType] = useState(
        route.params?.mealType || 'breakfast'
    );
    const [imageUri, setImageUri] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [hasPermission, setHasPermission] = useState(null);

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
                quality: 0.8,
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
            Alert.alert('Error', 'Failed to take photo. Please try again.');
        }
    };

    const pickImage = async () => {
        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.8,
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
            Alert.alert('Error', 'Failed to pick image. Please try again.');
        }
    };

    const analyzeImage = async () => {
        if (!imageUri) {
            Alert.alert('No Image', 'Please take a photo or select an image first.');
            return;
        }

        setAnalyzing(true);
        try {
            const analysisResult = await analyzeFoodImage(imageUri);
            setResult(analysisResult);
        } catch (error) {
            console.error('Error analyzing image:', error);
            Alert.alert(
                'Analysis Failed',
                'Could not analyze the image. Please try again with a clearer photo of your food.'
            );
        } finally {
            setAnalyzing(false);
        }
    };

    const saveMealEntry = async () => {
        if (!result) {
            Alert.alert('No Analysis', 'Please analyze the image first.');
            return;
        }

        try {
            await saveMeal({
                mealType: selectedMealType,
                calories: result.calories,
                description: result.description,
                items: result.items,
            });

            Alert.alert('Success', 'Meal logged successfully!', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                },
            ]);
        } catch (error) {
            console.error('Error saving meal:', error);
            Alert.alert('Error', 'Failed to save meal. Please try again.');
        }
    };

    const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
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
                                const icon = getMealTypeIcon(type);

                                return (
                                    <TouchableOpacity
                                        key={type}
                                        style={[
                                            styles.mealTypeButton,
                                            isSelected && {
                                                backgroundColor: color,
                                                borderColor: color,
                                            },
                                        ]}
                                        onPress={() => setSelectedMealType(type)}
                                    >
                                        <Text style={styles.mealTypeIcon}>{icon}</Text>
                                        <Text
                                            style={[
                                                styles.mealTypeText,
                                                isSelected && styles.mealTypeTextSelected,
                                            ]}
                                        >
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>

                    {/* Image Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Food Photo</Text>

                        {imageUri ? (
                            <View style={styles.imageContainer}>
                                <Image
                                    key={imageUri}
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                    resizeMode="cover"
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
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Text style={styles.imagePlaceholderIcon}>📸</Text>
                                <Text style={styles.imagePlaceholderText}>
                                    Take a photo or select from gallery
                                </Text>
                            </View>
                        )}

                        <View style={styles.imageButtons}>
                            <TouchableOpacity style={styles.imageButton} onPress={takePhoto}>
                                <Text style={styles.imageButtonIcon}>📷</Text>
                                <Text style={styles.imageButtonText}>Take Photo</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.imageButton} onPress={pickImage}>
                                <Text style={styles.imageButtonIcon}>🖼️</Text>
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
                            {analyzing ? (
                                <ActivityIndicator color={theme.colors.white} />
                            ) : (
                                <Text style={globalStyles.buttonText}>Analyze Food 🔍</Text>
                            )}
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
        backgroundColor: theme.colors.backgroundSecondary,
    },
    contentContainer: {
        padding: theme.spacing.md,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
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
        backgroundColor: theme.colors.white,
        borderWidth: 2,
        borderColor: theme.colors.border,
        alignItems: 'center',
    },
    mealTypeIcon: {
        fontSize: 24,
        marginBottom: theme.spacing.xs,
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
        backgroundColor: theme.colors.white,
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
        backgroundColor: theme.colors.white,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.md,
        alignItems: 'center',
        ...theme.shadows.sm,
    },
    imageButtonIcon: {
        fontSize: 32,
        marginBottom: theme.spacing.xs,
    },
    imageButtonText: {
        fontSize: theme.fontSize.sm,
        color: theme.colors.text,
        fontWeight: theme.fontWeight.medium,
    },
    analyzeButton: {
        marginBottom: theme.spacing.lg,
    },
    resultContainer: {
        backgroundColor: theme.colors.white,
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
