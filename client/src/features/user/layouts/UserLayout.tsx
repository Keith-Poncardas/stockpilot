import { Outlet } from 'react-router-dom'
/**
 * Base layout component for the User feature module.
 * 
 * Serves as a routing wrapper that renders nested child routes 
 * using react-router-dom's Outlet.
 * 
 * @returns {JSX.Element} The rendered Outlet for child routes.
 */
export function UserLayout() {
    return <Outlet />
};
