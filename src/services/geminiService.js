import { GoogleGenerativeAI } from '@google/generative-ai';
import { readAsStringAsync } from 'expo-file-system/legacy';

// Initialize Gemini API
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Analyzes a food image and returns calorie information
 * @param {string} imageUri - The URI of the image to analyze
 * @returns {Promise<{calories: number, description: string, items: string[]}>}
 */
export const analyzeFoodImage = async (imageUri) => {
    try {
        console.log('Starting image analysis...');
        console.log('Image URI:', imageUri);

        // Get the generative model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        // Convert image to base64 using Expo FileSystem
        const base64 = await readAsStringAsync(imageUri, {
            encoding: 'base64',
        });

        console.log('Image converted to base64, length:', base64.length);

        // Create the prompt for calorie analysis
        const prompt = `Analyze this food image and provide:
1. Total estimated calories for the entire plate/meal
2. A brief description of the food items visible
3. A list of individual food items

Please respond in the following JSON format only, no other text:
{
  "calories": <number>,
  "description": "<brief description>",
  "items": ["<item1>", "<item2>", ...]
}

Be as accurate as possible with calorie estimates based on typical portion sizes shown in the image.`;

        console.log('Sending request to Gemini API...');

        // Generate content with the image
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: 'image/jpeg',
                    data: base64,
                },
            },
        ]);

        const responseText = result.response.text();
        console.log('Gemini response:', responseText);

        // Try to parse JSON from the response
        // Sometimes the model wraps JSON in markdown code blocks
        let jsonText = responseText;
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        if (jsonMatch) {
            jsonText = jsonMatch[1];
        } else {
            // Try to find JSON object in the text
            const objectMatch = responseText.match(/\{[\s\S]*\}/);
            if (objectMatch) {
                jsonText = objectMatch[0];
            }
        }

        const parsedResult = JSON.parse(jsonText);

        return {
            calories: parsedResult.calories || 0,
            description: parsedResult.description || 'Food items detected',
            items: parsedResult.items || [],
        };
    } catch (error) {
        console.error('Error analyzing food image:', error);
        console.error('Error details:', error.message);
        throw new Error('Failed to analyze food image. Please try again.');
    }
};

/**
 * Test function to verify API key is working
 */
export const testGeminiConnection = async () => {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
        const result = await model.generateContent('Say hello');
        return result.response.text();
    } catch (error) {
        console.error('Gemini API connection test failed:', error);
        throw error;
    }
};
