import { Outlet } from 'react-router-dom'

export function UserLayout() {
    return (
        <div className="flex flex-col gap-3">
            <Outlet />
        </div>
    )
}
