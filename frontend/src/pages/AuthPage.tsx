import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LoginForm } from '../features/auth/LoginForm';
import { RegisterForm } from '../features/auth/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

type AuthTab = 'signin' | 'signup';

export default function AuthPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams] = useSearchParams();
    const initialTab = (searchParams.get('tab') as AuthTab) || 'signin';
    const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);

    const handleAuthSuccess = () => {
        // Redirect to home page after successful login/register
        navigate('/');
    };

    const switchToRegister = () => setActiveTab('signup');
    const switchToLogin = () => setActiveTab('signin');

    return (
        <div className="min-h-screen bg-[#10142C] flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Tab Headers */}
                <div className="flex mb-0 rounded-t-lg overflow-hidden">
                    <button
                        onClick={switchToLogin}
                        className={`flex-1 py-4 text-sm font-bold tracking-wider transition-colors cursor-pointer ${activeTab === 'signin'
                            ? 'bg-white text-black'
                            : 'bg-[#3d2f5a] text-white hover:bg-[#4a3866]'
                            }`}
                    >
                        SIGN IN
                    </button>
                    <button
                        onClick={switchToRegister}
                        className={`flex-1 py-4 text-sm font-bold tracking-wider transition-colors cursor-pointer ${activeTab === 'signup'
                            ? 'bg-white text-black'
                            : 'bg-[#3d2f5a] text-white hover:bg-[#4a3866]'
                            }`}
                    >
                        SIGN UP
                    </button>
                </div>

                {/* Form Container */}
                <div className="bg-white rounded-b-lg p-8 shadow-2xl">
                    {activeTab === 'signin' ? (
                        <LoginForm
                            onSuccess={handleAuthSuccess}
                        />
                    ) : (
                        <RegisterForm
                            onSuccess={handleAuthSuccess}
                            onSwitchToLogin={switchToLogin}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
