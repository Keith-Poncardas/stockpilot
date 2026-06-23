import React from 'react'
import {
    LayoutDashboard,
    UserCircle,
    LogOut,
    X,
} from 'lucide-react'
import AppLogo from '@/components/AppLogo'
import UserAvatar from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuthStore, useUIStore } from '@/store'
import { cn } from '@/lib/utils'
import { Link, useLocation } from 'react-router-dom'

interface NavItemConfig {
    label: string
    icon: React.ReactNode
    badge?: string
    badgeDanger?: boolean
    active?: boolean
    route: string
}

interface NavSectionConfig {
    section: string
    items: NavItemConfig[]
}

const NAV_SECTIONS: NavSectionConfig[] = [
    {
        section: 'Main',
        items: [
            {
                label: 'Home',
                icon: <LayoutDashboard size={16} />,
                route: "/"
            },
        ],
    },
    // {
    //     section: 'Operations',
    //     items: [
    //         { label: 'Sales', icon: <ShoppingCart size={16} />, badge: '12', route: "/sales" },
    //         { label: 'Customers', icon: <Users size={16} />, route: "/customers" },
    //     ],
    // },
    // {
    //     section: 'Inventory',
    //     items: [
    //         { label: 'Products', icon: <Box size={16} />, route: "/products" },
    //         { label: 'Inventory', icon: <Warehouse size={16} />, badge: '3', badgeDanger: true, route: "/inventory" },
    //         { label: 'Stock Movements', icon: <ArrowUpDown size={16} />, route: "/stock-movements" },
    //     ],
    // },
    {
        section: 'Administration',
        items: [
            { label: 'Users', icon: <UserCircle size={16} />, active: true, route: '/users' },
        ],
    },
]

/**
 * Unified sidebar that works for both desktop and mobile.
 *
 * - Desktop (≥ lg / 1024 px): `relative` — occupies its natural space in the
 *   flex layout and is always visible.
 * - Mobile (< lg): `fixed` — slides in from the left via CSS `transform`.
 *   A backdrop is rendered behind it; clicking it or resizing to desktop
 *   closes it automatically.
 *
 * Open/close state is driven by Zustand's `useUIStore`.
 */
function Sidebar() {
    const location = useLocation();

    const { isSidebarDrawerOpen, closeSidebarDrawer } = useUIStore()
    const { logout, user } = useAuthStore()

    // Auto-close when the viewport expands past the lg breakpoint (1024 px)
    React.useEffect(() => {
        const mql = window.matchMedia('(min-width: 1024px)')
        const handleChange = (e: MediaQueryListEvent) => {
            if (e.matches) closeSidebarDrawer()
        }
        mql.addEventListener('change', handleChange)
        return () => mql.removeEventListener('change', handleChange)
    }, [closeSidebarDrawer])

    function handleLogout() {
        logout()
        closeSidebarDrawer()
    }

    return (
        <>
            {/* ── Backdrop (mobile only) ───────────────────────────────── */}
            <div
                aria-hidden="true"
                onClick={closeSidebarDrawer}
                className={cn(
                    'fixed inset-0 z-40 bg-black/50 lg:hidden',
                    isSidebarDrawerOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none',
                )}
            />

            {/* ── Sidebar panel ────────────────────────────────────────── */}
            {/*
             * fixed  → on mobile it overlays content (doesn't affect layout)
             * lg:relative → on desktop it's part of the flex flow
             * transition-transform → smooth slide on open/close
             * lg:translate-x-0   → desktop: always fully visible
             * -translate-x-full  → mobile default: hidden off-screen
             * translate-x-0      → mobile open: slid in
             */}
            <aside
                className={cn(
                    'fixed lg:relative inset-y-0 left-0 z-50',
                    'w-67 shrink-0 flex flex-col h-screen bg-gray-900',

                    'lg:translate-x-0',
                    isSidebarDrawerOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                {/* Logo / Brand */}
                <div className="flex items-center justify-between h-14 px-4 border-b border-gray-800 shrink-0">
                    <Link to="/" onClick={closeSidebarDrawer}>
                        <AppLogo size="md" textClass="font-bold text-white" />
                    </Link>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden text-gray-400 hover:bg-white/5 hover:text-gray-200 -mr-1.5"
                        onClick={closeSidebarDrawer}
                        aria-label="Close sidebar"
                    >
                        <X size={20} strokeWidth={3} />
                    </Button>
                </div>

                {/* Navigation — grows + scrolls */}
                <nav className="flex-1 overflow-y-auto py-3">
                    {NAV_SECTIONS.map(({ section, items }) => (
                        <React.Fragment key={section}>
                            <NavSection label={section} />
                            {items.map((item) => {
                                const isActive = item.route === '/'
                                    ? location.pathname === '/'
                                    : location.pathname === item.route || location.pathname.startsWith(`${item.route}/`);

                                return (
                                    <NavItem
                                        key={item.label}
                                        {...item}
                                        active={isActive}
                                    />
                                );
                            })}
                        </React.Fragment>
                    ))}
                </nav>

                {/* User Card — pinned to bottom */}
                <div className="shrink-0 px-2 py-2 border-t border-gray-800">
                    <Link to={`/users/${user?.id}/view`} className="flex items-center gap-3 hover:bg-white/5 rounded-lg p-3">
                        <UserAvatar
                            fallback={user}
                            size="lg"
                            role={user?.role}
                        />
                        <div className="flex-1 min-w-0">
                            <p className="text-white text-[13px] font-semibold truncate">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-gray-500 text-[11px] truncate">
                                {user?.email}
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:bg-white/5 hover:text-gray-200 -mr-1.5"
                            onClick={handleLogout}
                            aria-label="Close sidebar"
                        >
                            <LogOut size={20} strokeWidth={3} />
                        </Button>
                    </Link>
                </div>
            </aside>
        </>
    )
}

export default Sidebar

function NavSection({ label }: { label: string }) {
    return (
        <p className="px-4 pt-3 pb-1 text-[11px] font-bold uppercase tracking-widest text-gray-600">
            {label}
        </p>
    )
}

function NavItem({
    label,
    icon,
    active,
    badge,
    badgeDanger,
    route,
}: NavItemConfig) {
    const { closeSidebarDrawer } = useUIStore()

    return (
        <Link
            to={route}
            onClick={closeSidebarDrawer}
            className={cn(
                'flex items-center gap-2.5 mx-2 px-3 py-2.5 rounded-md text-sm font-medium cursor-pointer',
                active
                    ? 'bg-amber-400/15 text-amber-400'
                    : 'text-gray-400 hover:bg-white/5 hover:text-gray-200',
            )}
        >
            {icon}
            <span className="flex-1">{label}</span>
            {badge && (
                <Badge
                    className={cn(
                        badgeDanger ? 'bg-red-500 text-white' : 'bg-amber-400 text-black',
                    )}
                >
                    {badge}
                </Badge>
            )}
        </Link>
    )
}