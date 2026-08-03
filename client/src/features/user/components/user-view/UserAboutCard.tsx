import Badge from '@/components/Badge'
import { formatDate } from '@/lib/utils'
import type { IUserDetail } from '../../user.types'

interface UserAboutCardProps {
    user?: IUserDetail
    isLoading?: boolean
}

export function UserAboutCard({ user, isLoading }: UserAboutCardProps) {
    if (isLoading) {
        return (
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
        )
    }

    const details = [
        { label: 'Role', value: <Badge status={user?.role || ''} type='ROLE' /> },
        { label: 'Status', value: <Badge status={user?.status || ''} type='STATUS' /> },
        { label: 'Joined', value: <span className="font-medium text-gray-900">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span> },
        { label: 'Sales Processed', value: <span className="font-medium text-gray-900">{user?.salesProcessedCount ?? user?.salesProcessed ?? 0}</span> },
        { label: 'Stock Movements', value: <span className="font-medium text-gray-900">{user?.stockMovementsProcessedCount ?? user?.stockMovementProcessed ?? 0}</span> },
    ]

    return (
        <div className="bg-white border border-gray-200 rounded-md p-5">
            <h2 className="font-semibold text-gray-900 mb-4">About User</h2>
            <div className="space-y-4 text-sm">
                {details.map((detail, index) => (
                    <div key={index} className="flex items-center justify-between">
                        <span className="text-gray-500">{detail.label}</span>
                        {detail.value}
                    </div>
                ))}
            </div>
        </div>
    )
}
