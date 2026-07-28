import React from 'react';
import { ProfileViewLayout } from '@/components/ProfileViewLayout';

interface UserViewLayoutProps {
    children: React.ReactNode;
    header: React.ReactNode;
    isLoading?: boolean;
}

export function UserViewLayout({ children, header, isLoading }: UserViewLayoutProps) {
    return (
        <ProfileViewLayout
            header={header}
            isLoading={isLoading}
            backLabel="Back to Users"
            backUrl="/users"
            coverClassName="bg-gradient-to-r from-slate-800 via-blue-950 to-slate-800"
        >
            {children}
        </ProfileViewLayout>
    );
}
