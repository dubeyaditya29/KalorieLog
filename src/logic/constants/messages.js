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
