import { Menu, Search, Bell, SearchIcon, User, LogOut } from 'lucide-react'
import { UserProfileDetails } from '@/components/UserProfileDetails'
import { Button } from '@/components/ui/button'
import { PopoverHeader, PopoverTitle, PopoverDescription } from '@/components/ui/popover'
import { FilterPopover } from '@/components/FilterPopover'
import { useAuthStore, useUIStore } from '@/store'
import IconInput from '@/components/IconInput'
import { useNavigate } from 'react-router-dom'
import { PATHS } from '@/routes'
import { useState, forwardRef } from 'react'

const UserMenuTrigger = forwardRef<HTMLDivElement, { user: any }>(({ user, ...props }, ref) => {
    return (
        <div ref={ref} {...props} className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded-full p-2">
            <UserProfileDetails
                user={user}
                avatarSize="default"
                containerClassName="hidden md:block select-none"
                nameClassName="text-sm font-semibold text-gray-700"
            />
        </div>
    )
})

UserMenuTrigger.displayName = 'UserMenuTrigger'

function UserMenuHeader({ user }: { user: any }) {
    return (
        <>
            <PopoverHeader className="px-2 py-1.5 mb-1">
                <PopoverTitle className="truncate font-semibold">{user?.firstName} {user?.lastName}</PopoverTitle>
                <PopoverDescription className="truncate text-xs">{user?.email}</PopoverDescription>
            </PopoverHeader>
            <div className="h-px bg-gray-100 my-1 mx-2" />
        </>
    )
}

function Navbar() {
    const { user } = useAuthStore()
    const { openSidebarDrawer } = useUIStore()
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)
    const navigate = useNavigate();

    const userMenuOptions = [
        {
            label: "View Profile",
            icon: User,
            onClick: () => {
                setIsPopoverOpen(false)
                if (user?.id) navigate(PATHS.users.view(user.id))
            },
            className: "text-gray-600 hover:text-gray-900"
        },
        {
            label: "Logout",
            icon: LogOut,
            onClick: () => {
                setIsPopoverOpen(false)
                useAuthStore.getState().logout()
            },
            className: "text-red-600 hover:text-red-700 hover:bg-red-50"
        }
    ]

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
                <FilterPopover
                    open={isPopoverOpen}
                    onOpenChange={setIsPopoverOpen}
                    align="end"
                    contentClassName="w-46 rounded-xl gap-0"
                    noPadding={true}
                    customTrigger={<UserMenuTrigger user={user} />}
                    customHeader={<UserMenuHeader user={user} />}
                >
                    <div className="flex flex-col gap-0 mt-1">
                        {userMenuOptions.map((option, idx) => {
                            const Icon = option.icon
                            return (
                                <Button
                                    key={idx}
                                    variant="ghost"
                                    className={`w-full justify-start h-9 px-2 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-transparent ${option.className}`}
                                    onClick={option.onClick}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    {option.label}
                                </Button>
                            )
                        })}
                    </div>
                </FilterPopover>
            </div>
        </header>
    )
}

export default Navbar
