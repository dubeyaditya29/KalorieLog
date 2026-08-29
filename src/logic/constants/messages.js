/**
 * Centralized user-facing messages
 * All messages are designed to be friendly and match the app theme
 * Easy to modify in one place for future updates
 */

export const AUTH_MESSAGES = {
    // Success messages
    ACCOUNT_CREATED: {
        title: '🎉 Welcome!',
        message: 'Your account has been created successfully.',
    },
    PASSWORD_RESET_SENT: {
        title: '✉️ Check Your Email',
        message: 'We\'ve sent a password reset link to your email. Click the link to reset your password.',
    },
    EMAIL_FOUND: {
        title: '🎉 Found It!',
        message: 'We found your email address.',
    },

    // Info messages
    USER_EXISTS: {
        title: 'Account Exists',
        message: 'Looks like you already have an account. Please sign in instead.',
    },
    USER_NOT_FOUND: {
        title: 'No Account Found',
        message: 'We couldn\'t find an account with this email. Would you like to create one?',
    },
    PHONE_NOT_FOUND: {
        title: 'Not Found',
        message: 'No account is linked to this phone number. Please check and try again.',
    },

    // Error messages (user-friendly versions)
    INVALID_CREDENTIALS: {
        title: 'Oops!',
        message: 'The email or password you entered is incorrect. Please try again.',
    },
    INVALID_EMAIL: {
        title: 'Invalid Email',
        message: 'Please enter a valid email address.',
    },
    INVALID_PASSWORD: {
        title: 'Invalid Password',
        message: 'Password must be at least 6 characters long.',
    },
    PASSWORD_MISMATCH: {
        title: 'Passwords Don\'t Match',
        message: 'Please make sure both passwords are the same.',
    },
    INVALID_PHONE: {
        title: 'Invalid Phone',
        message: 'Please enter a valid phone number with at least 10 digits.',
    },
    NETWORK_ERROR: {
        title: 'Connection Issue',
        message: 'Please check your internet connection and try again.',
    },
    GENERIC_ERROR: {
        title: 'Something Went Wrong',
        message: 'An unexpected error occurred. Please try again later.',
    },
};

export const ONBOARDING_MESSAGES = {
    MISSING_FIELDS: {
        title: 'Missing Information',
        message: 'Please fill in all required fields to continue.',
    },
    INVALID_AGE: {
        title: 'Invalid Age',
        message: 'Please enter a valid age between 1 and 120.',
    },
    INVALID_HEIGHT: {
        title: 'Invalid Height',
        message: 'Please enter a valid height between 50 and 300 cm.',
    },
    INVALID_WEIGHT: {
        title: 'Invalid Weight',
        message: 'Please enter a valid weight between 20 and 500 kg.',
    },
    PROFILE_CREATED: {
        title: '🎉 All Set!',
        message: 'Your profile has been created. Let\'s start tracking!',
    },
    PROFILE_ERROR: {
        title: 'Oops!',
        message: 'We couldn\'t save your profile. Please try again.',
    },
};

export const GENERAL_MESSAGES = {
    CONFIRM_LOGOUT: {
        title: 'Sign Out',
        message: 'Are you sure you want to sign out?',
    },
    CONFIRM_DELETE: {
        title: 'Delete',
        message: 'Are you sure you want to delete this item? This cannot be undone.',
    },
    SUCCESS: {
        title: 'Success',
        message: 'Operation completed successfully.',
    },
};

/** Short health facts shown while a meal photo is being analyzed. */
export const ANALYSIS_DID_YOU_KNOW = [
    'Protein keeps you full longer than carbs or fat — that’s why a high-protein breakfast often reduces snacking later.',
    'Drinking a glass of water before a meal can help you notice true hunger versus thirst.',
    'Muscle uses more energy at rest than fat tissue, so strength training quietly raises daily calorie burn.',
    'Fibre from vegetables, oats and beans slows digestion and steadies blood sugar after a meal.',
    'Your brain is about 60% fat — omega-3s from fish, walnuts or flax help it run smoothly.',
    'Sleeping under 7 hours can raise hunger hormones the next day, making extra calories harder to resist.',
    'A handful of nuts (about 30g) is filling, but easy to overeat if you snack straight from the bag.',
    'Colourful plates usually mean more micronutrients. Aim for two colours besides brown or white.',
    'Cooking at home lets you control oil and salt — restaurant meals often hide both.',
    'Protein needs are easier to hit if you include some at every meal, not only at dinner.',
    'Walking 10 minutes after eating can blunt a blood-sugar spike more than you might expect.',
    'Liquid calories (juices, lattes, soda) add up fast because they don’t fill you like solid food.',
    'Your stomach stretches: eating slowly gives fullness signals about 20 minutes to catch up.',
    'Frozen vegetables are picked ripe and frozen quickly — they can be as nutritious as “fresh” produce that sat in transit.',
    'Caffeine can slightly raise metabolism, but it isn’t a substitute for sleep or a balanced plate.',
    'Strength + a calorie target works better than cardio alone if you want to keep muscle while losing fat.',
    'Label serving sizes are often smaller than what people pour. Check the grams, not just “1 serving”.',
    'Fermented foods like yogurt, kefir or kimchi support gut bacteria that influence digestion and mood.',
    'Skipping meals can lead to a larger evening intake. A modest lunch usually steadies the day.',
    'Consistency beats perfection: logging most meals teaches you more than an occasional “perfect” day.',
];

/**
 * Helper function to get user-friendly message from Supabase error
 * Maps technical errors to friendly messages
 */
export const getAuthErrorMessage = (error) => {
    const errorMessage = error?.message?.toLowerCase() || '';

    // User already exists
    if (errorMessage.includes('already registered') ||
        errorMessage.includes('already exists')) {
        return { ...AUTH_MESSAGES.USER_EXISTS, action: 'LOGIN' };
    }

    // User not found or invalid credentials
    if (errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('user not found') ||
        errorMessage.includes('invalid credentials')) {
        return { ...AUTH_MESSAGES.USER_NOT_FOUND, action: 'SIGNUP' };
    }

    // Invalid email
    if (errorMessage.includes('invalid email')) {
        return AUTH_MESSAGES.INVALID_EMAIL;
    }

    // Weak password
    if (errorMessage.includes('password') &&
        (errorMessage.includes('weak') || errorMessage.includes('short'))) {
        return AUTH_MESSAGES.INVALID_PASSWORD;
    }

    // Network error
    if (errorMessage.includes('network') ||
        errorMessage.includes('fetch') ||
        errorMessage.includes('connection')) {
        return AUTH_MESSAGES.NETWORK_ERROR;
    }

    // Default to generic error
    return AUTH_MESSAGES.GENERIC_ERROR;
};
