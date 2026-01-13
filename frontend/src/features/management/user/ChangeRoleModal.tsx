import { useState } from 'react';
import { X, Shield } from 'lucide-react';
import { userApi } from '../../../api/endpoints/user.api';
import type { User } from '../../../api/endpoints/auth.api';
import { Button } from '../../../components/common/Button';
import { useToast } from '../../../components/common/ToastProvider';

interface Props {
    user: User;
    onClose: () => void;
    onUpdated: () => void;
}

export default function ChangeRoleModal({ user, onClose, onUpdated }: Props) {
    const [isAdmin, setIsAdmin] = useState(user.roles?.includes('ADMIN') || false);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // USER is always included, ADMIN is optional
            const roles = isAdmin ? ['USER', 'ADMIN'] : ['USER'];
            await userApi.changeRoles(user._id, roles);
            toast.push('Roles updated successfully', 'success');
            onUpdated();
        } catch (error: unknown) {
            const apiError = error as { message?: string };
            toast.push(apiError?.message || 'Failed to update roles', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    <X size={24} />
                </button>

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Shield className="text-purple-600" size={24} />
                        <h2 className="text-xl font-bold text-gray-900">Change User Role</h2>
                    </div>
                    <p className="text-sm text-gray-600">
                        Modify role for <strong>{user.fullName || user.username || user.email}</strong>
                    </p>
                </div>

                {/* Admin Toggle */}
                <div className="mb-6">
                    <label
                        className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                            isAdmin
                                ? 'bg-yellow-50 border-yellow-400'
                                : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setIsAdmin(!isAdmin)}
                    >
                        <div className="flex items-center gap-3">
                            <Shield className={isAdmin ? 'text-yellow-600' : 'text-gray-400'} size={20} />
                            <div>
                                <span className="font-medium text-gray-900">Admin</span>
                                <p className="text-xs text-gray-500">
                                    Can manage content and users
                                </p>
                            </div>
                        </div>
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors ${isAdmin ? 'bg-yellow-500' : 'bg-gray-300'}`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform ${isAdmin ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                    </label>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        type="button"
                        intent="secondary"
                        onClick={onClose}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        intent="primary"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="flex-1"
                    >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
