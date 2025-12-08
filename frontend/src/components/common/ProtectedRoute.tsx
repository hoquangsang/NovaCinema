import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
    const { user, isAuthenticated } = useAuth();

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    // If admin is required but user is not admin, redirect to home
    if (requireAdmin && !user?.roles?.includes('admin')) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
