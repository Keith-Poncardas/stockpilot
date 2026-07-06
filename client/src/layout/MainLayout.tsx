import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'

function MainLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/*
             * Single <Sidebar> handles both desktop (relative, in-flow) and
             * mobile (fixed, slides in). No separate SidebarDrawer needed.
             */}
            <Sidebar />

            {/* Main Content Column */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Navbar />

                <main className="flex-1 overflow-y-auto p-5 bg-[#F5F5F2]">
                    <div className="flex flex-col gap-3">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default MainLayout
