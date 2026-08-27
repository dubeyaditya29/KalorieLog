/**
 * Tests for: Profile management (get / upsert / update / completeness)
 * Covers: src/logic/services/api/profileService.js
 */
import { createQueryResult } from './mockSupabaseQuery';

jest.mock('../supabase', () => require('./mockSupabaseQuery').SUPABASE_MOCK_FACTORY());

import { supabase } from '../supabase';
import { getProfile, upsertProfile, updateProfile, hasCompletedProfile } from '../profileService';

const USER_ID = '11111111-1111-1111-1111-111111111111';
const FULL_PROFILE = {
    id: USER_ID,
    name: 'Aditya',
    age: 25,
    height_cm: 175,
    weight_kg: 70,
};

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Feature: Profile — getProfile', () => {
    it('queries the profiles table scoped by user id', async () => {
        const query = createQueryResult({ data: FULL_PROFILE, error: null });
        supabase.from.mockReturnValue(query);

        const { data, error } = await getProfile(USER_ID);

        expect(supabase.from).toHaveBeenCalledWith('profiles');
        expect(query.eq).toHaveBeenCalledWith('id', USER_ID);
        expect(query.single).toHaveBeenCalled();
        expect(data.name).toBe('Aditya');
        expect(error).toBeNull();
    });

    it('returns { data: null, error } when the query fails', async () => {
        const boom = new Error('row not found');
        supabase.from.mockReturnValue(createQueryResult({ data: null, error: boom }));

        const { data, error } = await getProfile(USER_ID);

        expect(data).toBeNull();
        expect(error).toBe(boom);
    });
});

describe('Feature: Profile — upsertProfile', () => {
    it('stamps updated_at and returns the saved row', async () => {
        const query = createQueryResult({ data: FULL_PROFILE, error: null });
        supabase.from.mockReturnValue(query);

        const { data, error } = await upsertProfile(USER_ID, { name: 'Aditya', age: 25 });

        expect(query.upsert).toHaveBeenCalledWith(
            expect.objectContaining({ id: USER_ID, name: 'Aditya' })
        );
        const payload = query.upsert.mock.calls[0][0];
        expect(payload.updated_at).toBeTruthy();
        expect(data.id).toBe(USER_ID);
        expect(error).toBeNull();
    });
});

describe('Feature: Profile — updateProfile', () => {
    it('updates only the given fields on the caller’s own row', async () => {
        const query = createQueryResult({ data: { ...FULL_PROFILE, age: 26 }, error: null });
        supabase.from.mockReturnValue(query);

        const { data, error } = await updateProfile(USER_ID, { age: 26 });

        expect(supabase.from).toHaveBeenCalledWith('profiles');
        expect(query.update).toHaveBeenCalledWith(
            expect.objectContaining({ age: 26 })
        );
        expect(query.eq).toHaveBeenCalledWith('id', USER_ID);
        expect(data.age).toBe(26);
        expect(error).toBeNull();
    });

    it('propagates errors without throwing', async () => {
        const boom = new Error('RLS violation');
        supabase.from.mockReturnValue(createQueryResult({ data: null, error: boom }));

        const { data, error } = await updateProfile(USER_ID, { age: 26 });

        expect(data).toBeNull();
        expect(error).toBe(boom);
    });
});

describe('Feature: Profile — hasCompletedProfile', () => {
    it.each([
        ['complete profile', FULL_PROFILE, true],
        ['missing name', { ...FULL_PROFILE, name: '' }, false],
        ['missing age', { ...FULL_PROFILE, age: null }, false],
        ['missing height', { ...FULL_PROFILE, height_cm: null }, false],
        ['missing weight', { ...FULL_PROFILE, weight_kg: undefined }, false],
    ])('detects %s', async (_label, profile, expected) => {
        supabase.from.mockReturnValue(createQueryResult({ data: profile, error: null }));
        expect(await hasCompletedProfile(USER_ID)).toBe(expected);
    });

    it('treats query failure as incomplete', async () => {
        supabase.from.mockReturnValue(
            createQueryResult({ data: null, error: new Error('offline') })
        );
        expect(await hasCompletedProfile(USER_ID)).toBe(false);
    });
});
