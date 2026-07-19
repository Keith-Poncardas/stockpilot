import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface UserViewLayoutProps {
    children: React.ReactNode
    header: React.ReactNode
    isLoading?: boolean
}

export function UserViewLayout({ children, header, isLoading }: UserViewLayoutProps) {
    const navigate = useNavigate()

    return (
        <div className="w-full min-h-[calc(100vh-4rem)]">
            {/* Cover Photo */}
            <div className={cn(
                "h-48 md:h-45 w-full relative flex justify-center items-end rounded-md max-w-7xl mx-auto border border-gray-200",
                isLoading ? "bg-slate-200 animate-pulse" : "bg-slate-200"
            )}>
                <Button
                    variant="secondary"
                    className={cn(
                        "absolute top-4 left-4 gap-2 hover:bg-white text-slate-700 backdrop-blur-sm h-9 px-3 border border-white/50",
                        isLoading ? "z-10" : ""
                    )}
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
                        {header}
                    </div>
                </div>

                {/* Tabs Area */}
                {isLoading ? (
                    <div className="flex flex-row items-center gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
                        {[20, 20, 24, 20].map((w, i) => (
                            <div key={i} className={`h-6 w-${w} bg-slate-200 animate-pulse rounded-md`}></div>
                        ))}
                    </div>
                ) : (
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
                )}
            </div>

            {/* Main Content Area */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </div>
        </div>
    )
}
