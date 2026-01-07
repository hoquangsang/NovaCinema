import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../api/endpoints/auth.api';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { useToast } from '../components/common/ToastProvider';
import { validatePassword } from '../utils/passwordValidation';
import { PasswordRequirements } from '../components/common/PasswordRequirements';

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const { push: showToast } = useToast();

    const [step, setStep] = useState<'request' | 'reset'>('request');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errors, setErrors] = useState<{
        email?: string;
        otp?: string;
        newPassword?: string;
        confirmPassword?: string;
    }>({});

    const [isLoading, setIsLoading] = useState(false);

    // Validate email format
    const validateEmail = (): boolean => {
        if (!email.trim()) {
            setErrors({ email: 'Email is required' });
            return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrors({ email: 'Please enter a valid email address' });
            return false;
        }
        setErrors({});
        return true;
    };

    // Validate reset password form
    const validateResetForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!otp.trim()) {
            newErrors.otp = 'OTP is required';
        } else if (!/^\d{6}$/.test(otp)) {
            newErrors.otp = 'OTP must be 6 digits';
        }

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else {
            const passwordValidation = validatePassword(newPassword);
            if (!passwordValidation.isValid) {
                newErrors.newPassword = passwordValidation.errors[0]; // Show first error
            }
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (confirmPassword !== newPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle request OTP
    const handleRequestOTP = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmail()) {
            return;
        }

        setIsLoading(true);

        try {
            await authApi.requestPasswordReset(email);
            showToast('OTP has been sent to your email', 'success');
            setStep('reset');
        } catch (error: any) {
            showToast(error.message || 'Failed to send OTP. Please try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    // Handle reset password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateResetForm()) {
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword(email, otp, newPassword);
            showToast('Password reset successful! Please login with your new password.', 'success');

            // Redirect to login page after 1.5 seconds
            setTimeout(() => {
                navigate('/login');
            }, 1500);
        } catch (error: any) {
            showToast(error.message || 'Failed to reset password. Please check your OTP and try again.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#10142C] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {step === 'request' ? 'Forgot Password?' : 'Reset Password'}
                        </h1>
                        <p className="text-gray-600">
                            {step === 'request'
                                ? 'Enter your email to receive an OTP code'
                                : 'Enter the OTP code and your new password'}
                        </p>
                    </div>

                    {/* Step 1: Request OTP */}
                    {step === 'request' && (
                        <form onSubmit={handleRequestOTP} className="space-y-5">
                            <Input
                                label="Email"
                                type="email"
                                required
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    if (errors.email) {
                                        setErrors({});
                                    }
                                }}
                                error={errors.email}
                                autoComplete="email"
                            />

                            <Button
                                type="submit"
                                intent="primary"
                                disabled={isLoading}
                                className="w-full !bg-purple-600 hover:!bg-purple-700 font-bold text-base py-3"
                            >
                                {isLoading ? 'SENDING...' : 'SEND OTP'}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => navigate('/login')}
                                    className="text-sm text-purple-600 hover:text-purple-700 hover:underline font-semibold"
                                >
                                    ← Back to Login
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 2: Reset Password */}
                    {step === 'reset' && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <Input
                                label="Email"
                                type="email"
                                required
                                value={email}
                                disabled
                                className="bg-gray-50"
                            />

                            <Input
                                label="OTP Code"
                                type="text"
                                required
                                placeholder="Enter 6-digit OTP"
                                value={otp}
                                onChange={(e) => {
                                    // Only allow numbers and max 6 digits
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                    if (errors.otp) {
                                        setErrors(prev => ({ ...prev, otp: '' }));
                                    }
                                }}
                                error={errors.otp}
                                maxLength={6}
                            />

                            <div>
                                <Input
                                    label="New Password"
                                    type="password"
                                    required
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (errors.newPassword) {
                                            setErrors(prev => ({ ...prev, newPassword: '' }));
                                        }
                                    }}
                                    error={errors.newPassword}
                                    showPasswordToggle
                                    autoComplete="new-password"
                                />
                                <PasswordRequirements password={newPassword} />
                            </div>

                            <Input
                                label="Confirm Password"
                                type="password"
                                required
                                placeholder="Confirm new password"
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

                            <Button
                                type="submit"
                                intent="primary"
                                disabled={isLoading}
                                className="w-full !bg-purple-600 hover:!bg-purple-700 font-bold text-base py-3"
                            >
                                {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
                            </Button>

                            <div className="text-center space-y-2">
                                <button
                                    type="button"
                                    onClick={() => setStep('request')}
                                    className="text-sm text-gray-600 hover:text-gray-700 hover:underline"
                                >
                                    Didn't receive OTP? Resend
                                </button>
                                <div>
                                    <button
                                        type="button"
                                        onClick={() => navigate('/login')}
                                        className="text-sm text-purple-600 hover:text-purple-700 hover:underline font-semibold"
                                    >
                                        ← Back to Login
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
