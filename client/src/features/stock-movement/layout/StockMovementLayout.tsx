import { Outlet } from "react-router-dom";

/**
 * Layout component for the Stock Movement feature.
 * Serves as a wrapper to render nested routes related to stock movements.
 *
 * @returns {JSX.Element} The rendered Outlet for child routes.
 */
export function StockMovementLayout() {
    return <Outlet />
}