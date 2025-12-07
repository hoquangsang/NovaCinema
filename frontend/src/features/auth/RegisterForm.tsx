import React, { useState } from 'react';
import { authApi, type RegisterParams } from '../../api/endpoints/auth.api';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';

interface RegisterFormProps {
    onSuccess?: () => void;
    onSwitchToLogin?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onSwitchToLogin }) => {
    const [formData, setFormData] = useState<RegisterParams>({
        email: '',
        password: '',
        fullName: '',
        phoneNumber: '',
        dateOfBirth: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof RegisterParams | 'confirmPassword' | 'terms', string>>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState<string>('');

    const validateForm = (): boolean => {
        const newErrors: any = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = 'Birthday is required';
        }

        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
            newErrors.phoneNumber = 'Please enter a valid phone number';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreedToTerms) {
            newErrors.terms = 'You must agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setApiError('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await authApi.register(formData);

            // Store tokens
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);

            // Store user info
            localStorage.setItem('user', JSON.stringify(response.user));

            onSuccess?.();
        } catch (error: any) {
            setApiError(error.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (field: keyof RegisterParams) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {apiError && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3 text-sm text-red-600">
                    {apiError}
                </div>
            )}

            <Input
                label="FullName (Last, First)"
                type="text"
                required
                placeholder="FullName"
                value={formData.fullName}
                onChange={handleChange('fullName')}
                error={errors.fullName}
                autoComplete="name"
            />

            <Input
                label="Birthday"
                type="date"
                required
                placeholder="dd/mm/yyyy"
                value={formData.dateOfBirth}
                onChange={handleChange('dateOfBirth')}
                error={errors.dateOfBirth}
            />

            <Input
                label="Phone Number"
                type="tel"
                required
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange('phoneNumber')}
                error={errors.phoneNumber}
                autoComplete="tel"
            />

            <Input
                label="Email"
                type="email"
                required
                placeholder="Fill in email"
                value={formData.email}
                onChange={handleChange('email')}
                error={errors.email}
                autoComplete="email"
            />

            <Input
                label="Password"
                type="password"
                required
                placeholder="Password"
                value={formData.password}
                onChange={handleChange('password')}
                error={errors.password}
                showPasswordToggle
                autoComplete="new-password"
            />

            <Input
                label="Confirm Password"
                type="password"
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) {
                        setErrors(prev => ({ ...prev, confirmPassword: '' }));
                    }
                }}
                error={errors.confirmPassword}
                showPasswordToggle
                autoComplete="new-password"
            />

            <div className="space-y-2">
                <label className="flex items-start gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={agreedToTerms}
                        onChange={(e) => {
                            setAgreedToTerms(e.target.checked);
                            if (errors.terms) {
                                setErrors(prev => ({ ...prev, terms: '' }));
                            }
                        }}
                        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-purple-600 cursor-pointer focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700">
                        Customers have agreed to the{' '}
                        <a href="/terms" className="text-purple-600 hover:underline cursor-pointer">
                            terms and conditions
                        </a>{' '}
                        of Cinestar membership
                    </span>
                </label>
                {errors.terms && (
                    <p className="text-xs text-red-500 ml-6">{errors.terms}</p>
                )}
            </div>

            <Button
                type="submit"
                intent="primary"
                disabled={isLoading}
                className="w-full !bg-yellow-400 hover:!bg-yellow-500 font-bold text-base py-3"
            >
                {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
            </Button>

            <div className="text-center text-sm text-gray-600">
                Already have an account?{' '}
                <button
                    type="button"
                    onClick={onSwitchToLogin}
                    className="font-semibold text-purple-600 cursor-pointer hover:text-purple-700 hover:underline"
                >
                    Sign in
                </button>
            </div>
        </form>
    );
};
