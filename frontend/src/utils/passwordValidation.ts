/**
 * Password validation utility
 * Validates password strength according to security requirements
 */

export interface PasswordValidationResult {
    isValid: boolean;
    errors: string[];
}

export const PASSWORD_REQUIREMENTS = {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecialChar: true,
};

export const PASSWORD_REQUIREMENTS_TEXT = [
    'At least 8 characters',
    'Contains uppercase letter (A-Z)',
    'Contains lowercase letter (a-z)',
    'Contains number (0-9)',
    'Contains special character (!@#$%^&*...)',
];

/**
 * Validates password against security requirements
 * @param password - Password to validate
 * @returns Validation result with isValid flag and error messages
 */
export const validatePassword = (password: string): PasswordValidationResult => {
    const errors: string[] = [];

    // Check minimum length
    if (password.length < PASSWORD_REQUIREMENTS.minLength) {
        errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters`);
    }

    // Check for uppercase letter
    if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('Password must contain at least one uppercase letter (A-Z)');
    }

    // Check for lowercase letter
    if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('Password must contain at least one lowercase letter (a-z)');
    }

    // Check for number
    if (PASSWORD_REQUIREMENTS.requireNumber && !/[0-9]/.test(password)) {
        errors.push('Password must contain at least one number (0-9)');
    }

    // Check for special character
    if (PASSWORD_REQUIREMENTS.requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        errors.push('Password must contain at least one special character');
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
};

/**
 * Get password strength indicator
 * @param password - Password to check
 * @returns Strength level: 'weak', 'medium', 'strong'
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    const validation = validatePassword(password);

    if (validation.isValid) {
        return 'strong';
    }

    const passedChecks = PASSWORD_REQUIREMENTS_TEXT.length - validation.errors.length;

    if (passedChecks >= 3) {
        return 'medium';
    }

    return 'weak';
};
