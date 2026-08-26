import { Outlet } from "react-router-dom";

/**
 * SaleLayout component that serves as the layout wrapper for the sale feature routes.
 * It renders the nested child routes using react-router-dom's Outlet.
 *
 * @component
 * @returns {React.ReactElement} The rendered layout containing nested child routes.
 */
export function SaleLayout() {
    return <Outlet />
};

