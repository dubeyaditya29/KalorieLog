/**
 * Shared mock helper for Supabase PostgREST query chains.
 *
 * Returns a Proxy where every method call (select, eq, insert, ...) records
 * itself as a jest.fn and returns the same awaitable chain — mirroring how
 * the real supabase-js builder is awaitable at any terminal step.
 */
export const createQueryResult = (result) => {
    const target = {};
    const promise = Promise.resolve(result);
    let proxy;
    proxy = new Proxy(target, {
        get(t, prop) {
            if (prop === 'then' || prop === 'catch' || prop === 'finally') {
                return promise[prop].bind(promise);
            }
            if (!t[prop]) t[prop] = jest.fn(() => proxy);
            return t[prop];
        },
    });
    return proxy;
};

/** Standard supabase module mock factory (hoist-safe: no outer references). */
export const SUPABASE_MOCK_FACTORY = () => ({
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
});
