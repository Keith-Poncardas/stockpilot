
import { ProfileViewLayout } from '@/components/ProfileViewLayout';
import type { UserViewLayoutProps } from './types';

export function UserViewLayout({
    children,
    header,
    isLoading
}: UserViewLayoutProps) {
    return (
        <ProfileViewLayout
            header={header}
            isLoading={isLoading}
            backLabel="Back"
            coverClassName="bg-gradient-to-r from-slate-800 via-blue-950 to-slate-800"
        >
            {children}
        </ProfileViewLayout>
    );
}
