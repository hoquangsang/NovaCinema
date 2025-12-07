import React, { useState } from 'react';
import { Eye, EyeOff, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    required?: boolean;
    error?: string;
    showPasswordToggle?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, required, error, showPasswordToggle, type = 'text', className, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputType = showPasswordToggle && type === 'password'
            ? (showPassword ? 'text' : 'password')
            : type;

        return (
            <div className="w-full">
                {label && (
                    <label className="mb-2 block text-sm font-medium text-gray-800">
                        {label}
                        {required && <span className="ml-1 text-red-500">*</span>}
                    </label>
                )}

                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={clsx(
                            'w-full rounded-md border px-4 py-2.5 text-sm transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-purple-500',
                            error
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-300 bg-white hover:border-gray-400',
                            className
                        )}
                        {...props}
                    />

                    {showPasswordToggle && type === 'password' && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    )}

                </div>

                {error && (
                    <p className="mt-1 text-xs text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
