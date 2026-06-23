import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Plus, PenSquare, ArrowLeft, UserX } from 'lucide-react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_USER } from './user.queries'
import { formatDate } from '@/lib/utils'
import UserAvatar from '@/components/UserAvatar'
import Badge from '@/components/Badge'
import { EmptyState } from '@/components/ui/empty-state'

export function UserView() {
    const navigate = useNavigate()
    const { userId } = useParams()

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { userId },
        fetchPolicy: 'network-only',
    })

    if (loading) return <UserViewSkeleton />
    if (error) {
        const errorMessage = JSON.parse(error.message);
        const errCode = errorMessage[0].code;

        if (errCode === 'invalid_format') {
            return (
                <div className="flex flex-col items-center justify-center">
                    <EmptyState
                        icon={UserX}
                        title="User Not Found"
                        description="The user you are looking for does not exist."
                    />
                    <button className='bg-amber-400/15 text-amber-400 px-4 py-2 rounded-md cursor-pointer hover:bg-amber-400/20 flex items-center gap-2 font-bold' onClick={() => navigate(-1)}>
                        <ArrowLeft size={16} />
                        Go Back
                    </button>
                </div>
            )
        }


    }
    if (!data) return <p>No user found</p>

    const user = data.getUser
    console.log(user)

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] ">
            {/* Top Navigation */}

            {/* Cover Photo */}
            <div className="h-48 md:h-87.5 w-full bg-slate-200 relative flex justify-center items-end rounded-md max-w-7xl mx-auto border border-gray-200">

                <Button
                    variant="secondary"
                    className="absolute top-4 left-4 gap-2 hover:bg-white text-slate-700 backdrop-blur-sm h-9 px-3 border border-white/50"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} />
                    Back to Users
                </Button>

            </div>

            {/* Profile Info Area */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative pb-0 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-8 gap-4 mb-4">

                        {/* Avatar and Name */}
                        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative z-10">
                            {/* Avatar */}
                            <UserAvatar
                                fallback={user}
                                role={user?.role}
                                size="2xl"
                                className="mx-auto md:mx-0 shrink-0"
                            />

                            {/* Name and Info */}
                            <div className="flex flex-col items-center md:items-start md:mb-4 text-center md:text-left">
                                <h1 className="text-3xl font-bold text-gray-900">{`${user?.firstName} ${user?.lastName}`}</h1>
                                <p className="text-gray-500 font-medium text-[15px] mt-1">
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:mb-4 relative z-10 flex-wrap">
                            <Button className="gap-2 font-semibold px-4 h-9 ">
                                <Plus size={18} />
                                Edit User
                            </Button>
                            <Button variant="outline" className="gap-2 font-semibold px-4 h-9 border-gray-200 text-gray-700 ">
                                <PenSquare size={18} className="text-gray-500" />
                                Update Role
                            </Button>
                            <Button variant="outline" size="icon" className="h-9 w-12 border-gray-200 text-gray-700 ">
                                <MoreHorizontal size={20} />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Tabs Area */}
                <div className="flex flex-row items-center gap-1 pt-1 overflow-x-auto no-scrollbar">
                    {['Overview'].map((tab, idx) => (
                        <div key={tab} className="flex items-center">
                            <button
                                className={`px-4 py-3 font-semibold text-[15px] rounded-md transition-colors whitespace-nowrap
                                    ${idx === 0
                                        ? 'text-gray-900 border-b-[3px] border-gray-900 rounded-b-none'
                                        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`}
                            >
                                {tab}
                                {tab === 'More' && <span className="ml-1 text-[12px] opacity-70">▼</span>}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar / Info column */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-md p-5">
                            <h2 className="font-semibold text-gray-900 mb-4">About User</h2>
                            <div className="space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Role</span>
                                    <Badge status={user?.role || ''} type='ROLE' />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Status</span>
                                    <Badge status={user?.status || ''} type='STATUS' />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Joined</span>
                                    <span className="font-medium text-gray-900">{formatDate(user?.createdAt)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Sales Processed</span>
                                    <span className="font-medium text-gray-900">{user?.salesProcessed}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Stock Movements</span>
                                    <span className="font-medium text-gray-900">{user?.stockMovementProcessed}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Main content column */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-md p-5 min-h-75">
                            <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
                            <div className="flex flex-col items-center justify-center h-full pt-12 pb-8 text-gray-500 text-sm">
                                <div className="bg-gray-50 rounded-full p-3 mb-3">
                                    <MoreHorizontal size={24} className="text-gray-400" />
                                </div>
                                No recent activity to show.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function UserViewSkeleton() {
    const navigate = useNavigate()

    return (
        <div className="w-full min-h-[calc(100vh-4rem)] ">
            {/* Cover Photo Skeleton */}
            <div className="h-48 md:h-87.5 w-full bg-slate-200 animate-pulse relative flex justify-center items-end rounded-md max-w-7xl mx-auto border border-gray-200">
                <Button
                    variant="secondary"
                    className="absolute top-4 left-4 gap-2 hover:bg-white text-slate-700 backdrop-blur-sm h-9 px-3 border border-white/50 z-10"
                    onClick={() => navigate(-1)}
                >
                    <ArrowLeft size={16} />
                    Back to Users
                </Button>
            </div>

            {/* Profile Info Area */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative pb-0 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-8 gap-4 mb-4">
                        {/* Avatar and Name */}
                        <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative z-10">
                            {/* Avatar skeleton */}
                            <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-slate-300 animate-pulse shrink-0 mx-auto md:mx-0"></div>

                            {/* Name and Info */}
                            <div className="flex flex-col items-center md:items-start md:mb-4 w-full md:w-auto">
                                <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                                <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:mb-4 relative z-10 flex-wrap">
                            <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-md"></div>
                            <div className="h-9 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                            <div className="h-9 w-12 bg-slate-200 animate-pulse rounded-md"></div>
                        </div>
                    </div>
                </div>

                {/* Tabs Area */}
                <div className="flex flex-row items-center gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
                    <div className="h-6 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="h-6 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="h-6 w-24 bg-slate-200 animate-pulse rounded-md"></div>
                    <div className="h-6 w-20 bg-slate-200 animate-pulse rounded-md"></div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Sidebar / Info column */}
                    <div className="md:col-span-1 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-md p-5 space-y-6">
                            <div className="h-5 w-24 bg-slate-200 animate-pulse rounded-md"></div>
                            <div className="space-y-4">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <div key={i} className="flex justify-between items-center">
                                        <div className="h-4 w-20 bg-slate-100 animate-pulse rounded-md"></div>
                                        <div className="h-5 w-24 bg-slate-200 animate-pulse rounded-md"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {/* Main content column */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="bg-white border border-gray-200 rounded-md p-5 min-h-75">
                            <div className="h-5 w-32 bg-slate-200 animate-pulse rounded-md mb-6"></div>
                            <div className="space-y-6">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="h-10 w-10 bg-slate-200 animate-pulse rounded-full shrink-0"></div>
                                        <div className="space-y-2 flex-1 pt-1">
                                            <div className="h-4 w-3/4 bg-slate-200 animate-pulse rounded-md"></div>
                                            <div className="h-3 w-1/2 bg-slate-100 animate-pulse rounded-md"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
