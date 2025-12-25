import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, isAuthenticated, isLoading } = useAuth();

    // Wait for auth to initialize
    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-400'></div>
            </div>
        );
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to='/login' replace />;
    }

    // If admin is required but user is not admin, redirect to home
    if (requireAdmin && !user?.roles?.includes('ADMIN')) {
        return <Navigate to='/' replace />;
    }

    return <>{children}</>;
}
