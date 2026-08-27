/**
 * Tests for: AI features (food image analysis + nutritionist chat)
 * Covers: src/logic/services/api/geminiService.js
 */
jest.mock('@google/generative-ai', () => {
    const state = {
        modelConfig: undefined,
        modelInstance: { generateContent: jest.fn() },
    };
    return {
        GoogleGenerativeAI: jest.fn(() => ({
            getGenerativeModel: jest.fn((config) => {
                state.modelConfig = config;
                return state.modelInstance;
            }),
        })),
        __geminiState: state,
    };
});

jest.mock('expo-file-system/legacy', () => ({
    readAsStringAsync: jest.fn(async () => 'ZmFrZWJhc2U2NA=='),
}));

import { __geminiState } from '@google/generative-ai';
import { readAsStringAsync } from 'expo-file-system/legacy';
import { analyzeFoodImage, chatWithNutritionist, testGeminiConnection } from '../geminiService';

const respondWith = (text) => {
    __geminiState.modelInstance.generateContent.mockResolvedValueOnce({
        response: { text: () => text },
    });
};

const lastModelConfig = () => __geminiState.modelConfig;

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Feature: AI analysis — analyzeFoodImage parsing', () => {
    it('parses a clean JSON response with macros', async () => {
        respondWith(
            JSON.stringify({
                calories: 520,
                protein: 38,
                carbs: 45,
                fat: 20,
                description: 'Grilled chicken salad',
                items: ['chicken', 'lettuce'],
            })
        );

        const result = await analyzeFoodImage('file:///meal.jpg');

        expect(readAsStringAsync).toHaveBeenCalledWith('file:///meal.jpg', { encoding: 'base64' });
        expect(result.calories).toBe(520);
        expect(result.protein).toBe(38);
        expect(result.carbs).toBe(45);
        expect(result.fat).toBe(20);
        expect(result.items).toEqual(['chicken', 'lettuce']);
    });

    it('extracts JSON wrapped in a markdown code fence', async () => {
        respondWith('```json\n{"calories": 300, "description": "Toast", "items": ["toast"]}\n```');

        const result = await analyzeFoodImage('file:///x.jpg');

        expect(result.calories).toBe(300);
        expect(result.description).toBe('Toast');
    });

    it('extracts a JSON object embedded in chatty text', async () => {
        respondWith('Sure! Here is my estimate: {"calories": 210} — hope this helps!');

        expect((await analyzeFoodImage('file:///x.jpg')).calories).toBe(210);
    });

    it('fills safe defaults for missing fields', async () => {
        respondWith('{}');

        const result = await analyzeFoodImage('file:///x.jpg');

        expect(result.calories).toBe(0);
        expect(result.protein).toBe(0);
        expect(result.description).toBe('Food items detected');
        expect(result.items).toEqual([]);
    });

    it('throws a friendly error when the response is unparseable', async () => {
        respondWith('not json at all');

        await expect(analyzeFoodImage('file:///x.jpg')).rejects.toThrow(
            'Failed to analyze food image. Please try again.'
        );
    });
});

describe('Feature: AI chat — chatWithNutritionist', () => {
    const PROFILE = {
        name: 'Aditya',
        age: 25,
        gender: 'male',
        height_cm: 175,
        weight_kg: 70,
        activity_level: 'moderate',
    };

    it('sends prior turns with valid roles and returns the reply', async () => {
        respondWith('Eat more protein.');

        const history = [
            { role: 'user', text: 'What should I eat?' },
            { role: 'model', text: 'Balanced meals.' },
            { role: 'weird-role', text: 'hi' }, // coerced to user
        ];
        const { text, error } = await chatWithNutritionist(history, PROFILE);

        expect(text).toBe('Eat more protein.');
        expect(error).toBeNull();

        const contents = __geminiState.modelInstance.generateContent.mock.calls[0][0].contents;
        expect(contents.map((c) => c.role)).toEqual(['user', 'model', 'user']);
    });

    it('injects the profile into the system instruction for personalization', async () => {
        respondWith('ok');

        await chatWithNutritionist([], PROFILE);

        const systemInstruction = lastModelConfig().systemInstruction;

        expect(systemInstruction).toContain('You are Kyra');
        expect(systemInstruction).toContain('Name: Aditya');
        expect(systemInstruction).toContain('Height: 175 cm');
        expect(systemInstruction).toContain('Activity level: moderate');
    });

    it('omits the profile block when no profile exists yet', async () => {
        respondWith('ok');

        await chatWithNutritionist([], null);

        expect(lastModelConfig().systemInstruction).not.toContain('User profile:');
    });

    it('returns the error instead of throwing when the call fails', async () => {
        const boom = new Error('quota exceeded');
        __geminiState.modelInstance.generateContent.mockRejectedValueOnce(boom);

        const { text, error } = await chatWithNutritionist([{ role: 'user', text: 'hi' }], null);

        expect(text).toBeNull();
        expect(error).toBe(boom);
    });
});

describe('Feature: AI chat — testGeminiConnection', () => {
    it('returns the model reply', async () => {
        respondWith('hello');

        expect(await testGeminiConnection()).toBe('hello');
    });
});
