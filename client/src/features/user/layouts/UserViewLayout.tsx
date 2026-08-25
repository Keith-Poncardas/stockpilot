
import { ProfileViewLayout } from '@/components/ProfileViewLayout';
import type { UserViewLayoutProps } from './types';

/**
 * Layout component for the User Profile view.
 * 
 * Wraps the generic ProfileViewLayout with specific styling and default props
 * suitable for displaying a user's profile and related information.
 * 
 * @param {UserViewLayoutProps} props - Layout properties including children, header, and loading state.
 * @returns {JSX.Element} The rendered user view layout.
 */
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
};
