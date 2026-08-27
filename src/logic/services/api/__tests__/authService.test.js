/**
 * Tests for: Authentication (sign up / in, reset, forgot email, phone, session)
 * Covers: src/logic/services/api/authService.js
 */
import { createQueryResult } from './mockSupabaseQuery';

jest.mock('../supabase', () => require('./mockSupabaseQuery').SUPABASE_MOCK_FACTORY());

import { supabase } from '../supabase';
import {
    signUpWithEmail,
    signInWithEmail,
    sendPasswordResetEmail,
    getEmailByPhone,
    updatePhoneNumber,
    signOut,
    getSession,
    getCurrentUser,
} from '../authService';

beforeEach(() => {
    jest.clearAllMocks();
});

describe('Feature: Auth — signUpWithEmail', () => {
    it('normalizes the email before calling Supabase', async () => {
        supabase.auth.signUp.mockResolvedValue({ data: { user: {} }, error: null });

        await signUpWithEmail('  Aditya@Example.COM ', 'secret');

        expect(supabase.auth.signUp).toHaveBeenCalledWith({
            email: 'aditya@example.com',
            password: 'secret',
        });
    });

    it('rejects missing credentials without calling Supabase', async () => {
        const noEmail = await signUpWithEmail('', 'secret');
        const noPass = await signUpWithEmail('a@b.co', '');

        expect(noEmail.error.message).toBe('Email and password are required');
        expect(noPass.error.message).toBe('Email and password are required');
        expect(supabase.auth.signUp).not.toHaveBeenCalled();
    });
});

describe('Feature: Auth — signInWithEmail', () => {
    it('signs in with a normalized email', async () => {
        supabase.auth.signInWithPassword.mockResolvedValue({ data: { session: {} }, error: null });

        await signInWithEmail('User@Site.co', 'pw');

        expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
            email: 'user@site.co',
            password: 'pw',
        });
    });

    it('surfaces Supabase auth errors', async () => {
        const boom = new Error('Invalid login credentials');
        supabase.auth.signInWithPassword.mockResolvedValue({ data: null, error: boom });

        const { data, error } = await signInWithEmail('a@b.co', 'wrong');

        expect(data).toBeNull();
        expect(error).toBe(boom);
    });
});

describe('Feature: Auth — sendPasswordResetEmail', () => {
    it('requires an email', async () => {
        const res = await sendPasswordResetEmail('');
        expect(res.error.message).toBe('Email is required');
    });

    it('requests a reset for the normalized email', async () => {
        supabase.auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });

        await sendPasswordResetEmail(' A@B.CO ');

        expect(supabase.auth.resetPasswordForEmail).toHaveBeenCalledWith(
            'a@b.co',
            expect.any(Object)
        );
    });
});

describe('Feature: Auth — getEmailByPhone (forgot email)', () => {
    it('strips formatting from the phone number before the RPC', async () => {
        supabase.rpc.mockResolvedValue({ data: [{ email: 'found@x.co' }], error: null });

        await getEmailByPhone('+91 98765 43210');

        expect(supabase.rpc).toHaveBeenCalledWith('get_email_by_phone', {
            phone: '+919876543210',
        });
    });

    it('returns the first matching email', async () => {
        supabase.rpc.mockResolvedValue({ data: [{ email: 'found@x.co' }], error: null });

        const { email, error } = await getEmailByPhone('9876543210');

        expect(email).toBe('found@x.co');
        expect(error).toBeNull();
    });

    it('returns null email when no account matches (without erroring)', async () => {
        supabase.rpc.mockResolvedValue({ data: [], error: null });

        const { email, error } = await getEmailByPhone('0000000000');

        expect(email).toBeNull();
        expect(error).toBeNull();
    });

    it('requires a phone number', async () => {
        const res = await getEmailByPhone('');
        expect(res.error.message).toBe('Phone number is required');
    });
});

describe('Feature: Auth — updatePhoneNumber', () => {
    it('writes the cleaned number to the accounts table', async () => {
        const query = createQueryResult({ data: { id: 'u-1' }, error: null });
        supabase.from.mockReturnValue(query);

        const { error } = await updatePhoneNumber('u-1', '+91 11111 11111');

        expect(supabase.from).toHaveBeenCalledWith('accounts');
        expect(query.update).toHaveBeenCalledWith(
            expect.objectContaining({ phone_number: '+911111111111' })
        );
        expect(query.eq).toHaveBeenCalledWith('id', 'u-1');
        expect(error).toBeNull();
    });

    it('rejects empty inputs', async () => {
        const res = await updatePhoneNumber('u-1', '');
        expect(res.error).toBeTruthy();
        expect(supabase.from).not.toHaveBeenCalled();
    });
});

describe('Feature: Auth — session helpers', () => {
    it('signOut returns no error on success', async () => {
        supabase.auth.signOut.mockResolvedValue({ error: null });
        expect(await signOut()).toEqual({ error: null });
    });

    it('getSession returns the active session', async () => {
        const session = { user: { id: 'u-1' } };
        supabase.auth.getSession.mockResolvedValue({ data: { session }, error: null });

        const { session: got } = await getSession();

        expect(got).toBe(session);
    });

    it('getCurrentUser returns the user', async () => {
        const user = { id: 'u-1' };
        supabase.auth.getUser.mockResolvedValue({ data: { user }, error: null });

        const { user: got } = await getCurrentUser();

        expect(got).toBe(user);
    });
});
