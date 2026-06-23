import { Menu, Search, Bell, SearchIcon } from 'lucide-react'
import UserAvatar from '@/components/UserAvatar'
import { Button } from '@/components/ui/button'
import { useAuthStore, useUIStore } from '@/store'
import IconInput from '@/components/IconInput'
import { Link } from 'react-router-dom'

function Navbar() {
    const { user } = useAuthStore()
    const { openSidebarDrawer } = useUIStore()

    return (
        <header className="flex items-center gap-3 bg-white border-b border-gray-200 h-14 px-5 shrink-0 sticky top-0">

            {/* Hamburger — mobile only, opens the SidebarDrawer via Zustand */}
            <Button
                className="lg:hidden hover:text-gray-700"
                onClick={openSidebarDrawer}
                aria-label="Open sidebar"
                variant='ghost'
                size='lg'
            >
                <Menu size={28} strokeWidth={2.5} />
            </Button>

            {/* Search */}
            <div className="flex-1 flex items-center">
                {/* Full search — md and up */}
                <div className="relative w-full max-w-xs hidden md:block">
                    <IconInput
                        placeholder="Search anything..."
                        startAddon={<SearchIcon className="text-muted-foreground" />}
                        className='cursor-pointer'
                        readOnly
                    />
                </div>

                {/* Icon-only search — below md */}
                <Button variant="ghost" size="lg" className="md:hidden text-gray-500 hover:text-gray-700">
                    <Search size={28} strokeWidth={2.5} />
                </Button>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3">

                {/* Notifications */}
                <Button className="relative text-gray-500 hover:text-gray-700" variant="ghost" size='lg'>
                    <Bell size={28} strokeWidth={2.5} />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
                </Button>

                {/* User */}
                <Link to={`/users/${user?.id}/view`}>
                    <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full p-2">
                        <UserAvatar fallback={user} size="default" role={user?.role} />
                        <span className="text-sm font-semibold text-gray-700 hidden md:block">
                            {user?.firstName} {user?.lastName}
                        </span>
                    </div>
                </Link>
            </div>
        </header>
    )
}

export default Navbar
