export default ({ config }) => ({
    ...config,
    extra: {
        ...(config.extra || {}),
        geminiApiKey:
            process.env.EXPO_GEMINI_API_KEY || process.env.EXPO_PUBLIC_GEMINI_API_KEY,
        supabaseAnonKey:
            process.env.EXPO_SUPABASE_ANON_KEY || process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
    },
});
