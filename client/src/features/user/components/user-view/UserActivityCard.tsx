import { MoreHorizontal } from 'lucide-react'

interface UserActivityCardProps {
    isLoading?: boolean
}

export function UserActivityCard({ isLoading }: UserActivityCardProps) {
    if (isLoading) {
        return (
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
        )
    }

    return (
        <div className="bg-white border border-gray-200 rounded-md p-5 min-h-75">
            <h2 className="font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="flex flex-col items-center justify-center h-full pt-12 pb-8 text-gray-500 text-sm">
                <div className="bg-gray-50 rounded-full p-3 mb-3">
                    <MoreHorizontal size={24} className="text-gray-400" />
                </div>
                No recent activity to show.
            </div>
        </div>
    )
}
