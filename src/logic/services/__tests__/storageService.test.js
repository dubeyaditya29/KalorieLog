/**
 * Tests for: Meal data facade (snake_case ↔ camelCase mapping, auth gating)
 * Covers: src/logic/services/storageService.js
 */
jest.mock('../api/supabase', () => ({
    supabase: {
        from: jest.fn(),
        rpc: jest.fn(),
        auth: {
            getUser: jest.fn(),
            getSession: jest.fn(),
            signUp: jest.fn(),
            signInWithPassword: jest.fn(),
            resetPasswordForEmail: jest.fn(),
            signOut: jest.fn(),
        },
    },
}));
jest.mock('../api/mealService');
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

import { createQueryResult } from '../api/__tests__/mockSupabaseQuery';
import { supabase } from '../api/supabase';
import {
    saveMealToCloud,
    getUserMeals,
    getTodaysMealsFromCloud,
    getTotalCaloriesByDateFromCloud,
    deleteMealFromCloud,
} from '../api/mealService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    saveMeal,
    getAllMeals,
    getTodaysMeals,
    getMealsByDate,
    getTotalCaloriesByDate,
    deleteMeal,
    getCaloriesByMealType,
    clearAllMeals,
    getWeeklySummary,
} from '../storageService';

const USER_ID = 'u-1';

const DB_MEAL = (overrides = {}) => ({
    id: 'm-1',
    logged_at: new Date('2026-08-26T10:00:00Z').toISOString(),
    meal_type: 'lunch',
    calories: 650,
    description: 'Chicken rice bowl',
    items: ['chicken', 'rice'],
    protein_g: 45,
    carbs_g: 60,
    fat_g: 18,
    ...overrides,
});

const authed = () =>
    supabase.auth.getUser.mockResolvedValue({ data: { user: { id: USER_ID } }, error: null });

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Feature: Meal facade — saveMeal', () => {
    it('delegates to the cloud with the authenticated user’s id', async () => {
        authed();
        saveMealToCloud.mockResolvedValue({ data: DB_MEAL(), error: null });

        const saved = await saveMeal({ mealType: 'lunch', calories: 650 });

        expect(saveMealToCloud).toHaveBeenCalledWith(USER_ID, { mealType: 'lunch', calories: 650 });
        expect(saved.id).toBe('m-1');
    });

    it('throws a friendly error when not signed in', async () => {
        supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });

        await expect(saveMeal({ calories: 100 })).rejects.toThrow('Failed to save meal');
        expect(saveMealToCloud).not.toHaveBeenCalled();
    });
});

describe('Feature: Meal facade — snake_case → camelCase mapping', () => {
    it('getAllMeals maps db rows to app format', async () => {
        authed();
        getUserMeals.mockResolvedValue({ data: [DB_MEAL()], error: null });

        const [meal] = await getAllMeals();

        expect(meal).toEqual({
            id: 'm-1',
            timestamp: new Date(DB_MEAL().logged_at).getTime(),
            mealType: 'lunch',
            calories: 650,
            description: 'Chicken rice bowl',
            items: ['chicken', 'rice'],
            protein: 45,
            carbs: 60,
            fat: 18,
        });
    });

    it('getTodaysMeals maps rows and defaults missing macros/items', async () => {
        authed();
        getTodaysMealsFromCloud.mockResolvedValue({
            data: [
                DB_MEAL({
                    protein_g: null,
                    carbs_g: null,
                    fat_g: null,
                    items: null,
                }),
            ],
            error: null,
        });

        const [meal] = await getTodaysMeals();

        expect(meal.protein).toBeNull();
        expect(meal.items).toEqual([]);
    });

    it('getMealsByDate queries the day range via Supabase directly', async () => {
        authed();
        const query = createQueryResult({ data: [DB_MEAL()], error: null });
        supabase.from.mockReturnValue(query);

        await getMealsByDate(new Date('2026-08-26T15:00:00'));

        expect(supabase.from).toHaveBeenCalledWith('meals');
        expect(query.gte).toHaveBeenCalled();
        expect(query.lte).toHaveBeenCalled();
    });

    it('returns [] instead of throwing when the fetch fails or user is signed out', async () => {
        authed();
        getTodaysMealsFromCloud.mockResolvedValue({
            data: null,
            error: new Error('offline'),
        });
        expect(await getTodaysMeals()).toEqual([]);

        supabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: null });
        expect(await getAllMeals()).toEqual([]);
        expect(await getTotalCaloriesByDate(new Date())).toBe(0);
    });
});

describe('Feature: Meal facade — totals & breakdowns', () => {
    it('getTotalCaloriesByDate passes the cloud total through', async () => {
        authed();
        getTotalCaloriesByDateFromCloud.mockResolvedValue({ data: 1400, error: null });

        expect(await getTotalCaloriesByDate(new Date())).toBe(1400);
    });

    it('getCaloriesByMealType aggregates per type and ignores unknown types', async () => {
        authed();
        const query = createQueryResult({
            data: [
                DB_MEAL({ id: 'a', meal_type: 'breakfast', calories: 300 }),
                DB_MEAL({ id: 'b', meal_type: 'lunch', calories: 500 }),
                DB_MEAL({ id: 'c', meal_type: 'lunch', calories: 200 }),
                DB_MEAL({ id: 'd', meal_type: 'mystery', calories: 999 }),
            ],
            error: null,
        });
        supabase.from.mockReturnValue(query);

        const breakdown = await getCaloriesByMealType(new Date());

        expect(breakdown).toEqual({
            breakfast: 300,
            lunch: 700,
            dinner: 0,
            snack: 0,
        });
    });
});

describe('Feature: Meal facade — deleteMeal & clearAllMeals', () => {
    it('deleteMeal returns true on success', async () => {
        deleteMealFromCloud.mockResolvedValue({ error: null });

        expect(await deleteMeal('m-1')).toBe(true);
        expect(deleteMealFromCloud).toHaveBeenCalledWith('m-1');
    });

    it('deleteMeal throws a friendly error on failure', async () => {
        deleteMealFromCloud.mockResolvedValue({ error: new Error('gone') });

        await expect(deleteMeal('m-1')).rejects.toThrow('Failed to delete meal');
    });

    it('clearAllMeals removes only the legacy local key', async () => {
        await clearAllMeals();

        expect(AsyncStorage.removeItem).toHaveBeenCalledWith('@kyra_meals');
    });
});

describe('Feature: Meal facade — getWeeklySummary', () => {
    it('groups the last 7 days of meals into daily totals', async () => {
        authed();
        const now = Date.now();
        const daysAgo = (n) => new Date(now - n * 86400000).toISOString();
        getUserMeals.mockResolvedValue({
            data: [
                DB_MEAL({ id: 'today-a', logged_at: daysAgo(0), calories: 500 }),
                DB_MEAL({ id: 'today-b', logged_at: daysAgo(0), calories: 300 }),
                DB_MEAL({ id: 'three-days', logged_at: daysAgo(3), calories: 800 }),
                DB_MEAL({ id: 'too-old', logged_at: daysAgo(9), calories: 4000 }),
            ],
            error: null,
        });

        const summary = await getWeeklySummary();

        const todayKey = new Date(daysAgo(0)).toDateString();
        const threeDaysKey = new Date(daysAgo(3)).toDateString();

        expect(Object.keys(summary)).toHaveLength(2);
        expect(summary[todayKey]).toBe(800);
        expect(summary[threeDaysKey]).toBe(800);
    });
});
