import { useAuthStore } from '@/store';
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole, UserStatus } from '@/features/user/user.constants';

interface ProtectedRouteProps {
    allowInactive?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowInactive = false }) => {
    const token = useAuthStore((state) => state.token);
    const user = useAuthStore((state) => state.user);

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (!allowInactive) {
        // If they don't have a user object yet (shouldn't happen with token, but just in case)
        if (!user) return <Navigate to="/login" replace />;
        
        if (user.status !== UserStatus.ACTIVE || user.role === UserRole.UNASSIGNED) {
            return <Navigate to="/pending-approval" replace />;
        }
    }

    return <Outlet />;
};
