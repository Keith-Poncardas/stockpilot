/**
 * Props for the UserViewLayout component.
 * 
 * @property {React.ReactNode} children - The main content of the layout.
 * @property {React.ReactNode} header - The header section of the layout (e.g., UserProfileHeader).
 * @property {boolean} [isLoading] - Optional flag indicating if the view is currently loading.
 */
export interface UserViewLayoutProps {
    children: React.ReactNode;
    header: React.ReactNode;
    isLoading?: boolean;
};