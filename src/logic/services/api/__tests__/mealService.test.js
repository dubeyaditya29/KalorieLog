/**
 * Tests for: Meal logging (save / list / totals / delete)
 * Covers: src/logic/services/api/mealService.js
 */
import { createQueryResult } from './mockSupabaseQuery';

jest.mock('../supabase', () => require('./mockSupabaseQuery').SUPABASE_MOCK_FACTORY());

import { supabase } from '../supabase';
import {
    saveMealToCloud,
    getUserMeals,
    getTodaysMealsFromCloud,
    getTotalCaloriesByDateFromCloud,
    deleteMealFromCloud,
    getMealsByType,
} from '../mealService';

const USER_ID = 'u-123';
const MEAL = {
    mealType: 'lunch',
    calories: 650,
    description: 'Chicken rice bowl',
    items: ['chicken', 'rice'],
    protein: 45,
    carbs: 60,
    fat: 18,
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Feature: Meal logging — saveMealToCloud', () => {
    it('maps app fields to snake_case columns', async () => {
        const query = createQueryResult({ data: { id: 'm-1' }, error: null });
        supabase.from.mockReturnValue(query);

        const { data, error } = await saveMealToCloud(USER_ID, MEAL);

        expect(supabase.from).toHaveBeenCalledWith('meals');
        expect(query.insert).toHaveBeenCalledWith(
            expect.objectContaining({
                user_id: USER_ID,
                meal_type: 'lunch',
                calories: 650,
                protein_g: 45,
                carbs_g: 60,
                fat_g: 18,
            })
        );
        const payload = query.insert.mock.calls[0][0];
        expect(payload.logged_at).toBeTruthy();
        expect(data.id).toBe('m-1');
        expect(error).toBeNull();
    });

    it('stores null macros when not provided', async () => {
        const query = createQueryResult({ data: {}, error: null });
        supabase.from.mockReturnValue(query);

        await saveMealToCloud(USER_ID, { mealType: 'snack', calories: 100 });

        expect(query.insert).toHaveBeenCalledWith(
            expect.objectContaining({ protein_g: null, carbs_g: null, fat_g: null })
        );
    });
});

describe('Feature: Meal logging — queries', () => {
    it('getUserMeals orders by newest first', async () => {
        const rows = [{ id: 'm-2' }, { id: 'm-1' }];
        const query = createQueryResult({ data: rows, error: null });
        supabase.from.mockReturnValue(query);

        const { data } = await getUserMeals(USER_ID);

        expect(query.eq).toHaveBeenCalledWith('user_id', USER_ID);
        expect(query.order).toHaveBeenCalledWith('logged_at', { ascending: false });
        expect(data).toHaveLength(2);
    });

    it('getTodaysMealsFromCloud filters from local midnight', async () => {
        const query = createQueryResult({ data: [], error: null });
        supabase.from.mockReturnValue(query);

        await getTodaysMealsFromCloud(USER_ID);

        const gteArg = query.gte.mock.calls[0][1];
        const midnight = new Date(gteArg);
        expect(midnight.getHours()).toBe(0);
        expect(midnight.getMinutes()).toBe(0);
        expect(midnight.getSeconds()).toBe(0);
    });

    it('getMealsByType filters by user and meal type for today', async () => {
        const query = createQueryResult({ data: [], error: null });
        supabase.from.mockReturnValue(query);

        await getMealsByType(USER_ID, 'breakfast');

        expect(query.eq).toHaveBeenCalledWith('user_id', USER_ID);
        expect(query.eq).toHaveBeenCalledWith('meal_type', 'breakfast');
    });

    it('getTotalCaloriesByDateFromCloud sums the day’s calories', async () => {
        const rows = [{ calories: 300 }, { calories: 450 }, { calories: null }];
        supabase.from.mockReturnValue(createQueryResult({ data: rows, error: null }));

        const { data } = await getTotalCaloriesByDateFromCloud(USER_ID, '2026-08-26');

        expect(data).toBe(750); // nulls count as 0
    });

    it('deleteMealFromCloud deletes by id', async () => {
        const query = createQueryResult({ data: null, error: null });
        supabase.from.mockReturnValue(query);

        const { error } = await deleteMealFromCloud('meal-9');

        expect(supabase.from).toHaveBeenCalledWith('meals');
        expect(query.delete).toHaveBeenCalled();
        expect(query.eq).toHaveBeenCalledWith('id', 'meal-9');
        expect(error).toBeNull();
    });
});

describe('Feature: Meal logging — error handling', () => {
    it.each([
        ['saveMealToCloud', () => saveMealToCloud(USER_ID, MEAL)],
        ['getUserMeals', () => getUserMeals(USER_ID)],
        ['getTodaysMealsFromCloud', () => getTodaysMealsFromCloud(USER_ID)],
        ['getTotalCaloriesByDateFromCloud', () => getTotalCaloriesByDateFromCloud(USER_ID, new Date())],
        ['deleteMealFromCloud', () => deleteMealFromCloud('m-1')],
        ['getMealsByType', () => getMealsByType(USER_ID, 'dinner')],
    ])('%s never throws — returns the error instead', async (_name, fn) => {
        const boom = new Error('network down');
        supabase.from.mockReturnValue(createQueryResult({ data: null, error: boom }));

        const result = await fn();

        expect(result.error).toBe(boom);
    });
});
