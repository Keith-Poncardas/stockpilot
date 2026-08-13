import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag, User as UserIcon, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { StatusBadge } from './StatusBadge';

export type ProfileStampType = 'Customer' | 'User' | string;

export interface ProfileStampProps {
    stamp: ProfileStampType;
}

export function ProfileStamp({ stamp }: ProfileStampProps) {
    const isCustomer = stamp.toLowerCase() === 'customer';
    const isUser = stamp.toLowerCase() === 'user';

    let icon: React.ReactNode;
    if (isCustomer) {
        icon = <ShoppingBag className="w-3.5 h-3.5 text-emerald-600" />;
    } else if (isUser) {
        icon = <UserIcon className="w-3.5 h-3.5 text-blue-600" />;
    } else {
        icon = <Tag className="w-3.5 h-3.5 text-indigo-600" />;
    }

    return (
        <StatusBadge
            value={stamp}
            icon={icon}
            withDot={false}

        />
    );
}

export interface ProfileViewLayoutProps {
    children: React.ReactNode;
    /** Profile title (e.g., Full Name) */
    title?: React.ReactNode;
    /** Profile subtitle (e.g., Email / Location / Member since) */
    subtitle?: React.ReactNode;
    /** Avatar element (e.g., <Avatar ... /> or <UserAvatar ... />) */
    avatar?: React.ReactNode;
    /** Stamp badge text (e.g., "Customer" or "User") */
    stamp?: ProfileStampType;
    /** Action buttons rendered on the right side of the profile header */
    actions?: React.ReactNode;
    /** Custom full header node if overriding title/subtitle/avatar/stamp/actions */
    header?: React.ReactNode;
    /** List of tab strings (defaults to ['Overview']) */
    tabs?: string[];
    /** Currently active tab */
    activeTab?: string;
    /** Callback when tab changes */
    onTabChange?: (tab: string) => void;
    /** Whether the profile is currently loading */
    isLoading?: boolean;
    /** Back button text (defaults to "Back") */
    backLabel?: string;
    /** Custom back button click handler */
    onBack?: () => void;
    /** Target URL for back button (if onBack is not specified) */
    backUrl?: string;
    /** Cover photo container background className */
    coverClassName?: string;
}

export function ProfileViewLayout({
    children,
    title,
    subtitle,
    avatar,
    stamp,
    actions,
    header,
    tabs = ['Overview'],
    activeTab,
    onTabChange,
    isLoading = false,
    backLabel = 'Back',
    onBack,
    backUrl,
    coverClassName,
}: ProfileViewLayoutProps) {
    const navigate = useNavigate();

    function handleBackClick() {
        if (onBack) {
            onBack();
        } else if (backUrl) {
            navigate(backUrl);
        } else {
            navigate(-1);
        }
    }

    return (
        <div className="w-full min-h-[calc(100vh-4rem)]">

            <div
                className={cn(
                    'h-48 md:h-52 w-full relative flex justify-center items-end rounded-b-xl border-b border-gray-200 bg-linear-to-r from-slate-800 via-indigo-950 to-slate-800',
                    coverClassName,
                    isLoading ? 'bg-slate-200 animate-pulse' : ''
                )}
            >
                <Button
                    variant="secondary"
                    className={cn(
                        'absolute top-4 left-4 gap-2 hover:bg-white text-slate-700 backdrop-blur-sm h-9 px-3 border border-white/50 shadow-sm',
                        isLoading ? 'z-10' : ''
                    )}
                    onClick={handleBackClick}
                >
                    <ArrowLeft size={16} />
                    {backLabel}
                </Button>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative pb-0 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16 md:-mt-14 gap-4 mb-4">
                        {header ? (
                            header
                        ) : (
                            <>
                                {/* Left side: Avatar + Name + Subtitle + Stamp */}
                                <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative z-10">
                                    {avatar && (
                                        <div className="mx-auto md:mx-0 shrink-0">
                                            {avatar}
                                        </div>
                                    )}
                                    <div className="flex flex-col items-center md:items-start md:mb-3 text-center md:text-left">
                                        {isLoading ? (
                                            <>
                                                <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-2" />
                                                <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-md" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-3 flex-wrap justify-center md:justify-start">
                                                    {title && (
                                                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                                                            {title}
                                                        </h1>
                                                    )}
                                                    {stamp && <ProfileStamp stamp={stamp} />}
                                                </div>
                                                {subtitle && (
                                                    <div className="text-gray-500 font-medium text-sm md:text-[15px] mt-1 flex flex-wrap items-center justify-center md:justify-start gap-2">
                                                        {subtitle}
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>

                                {/* Right side: Actions */}
                                {actions && !isLoading && (
                                    <div className="flex flex-row items-center justify-center md:justify-end gap-2 md:mb-3 relative z-10 flex-wrap">
                                        {actions}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex flex-row items-center gap-4 pt-4 pb-2 overflow-x-auto no-scrollbar">
                            {[20, 20, 24].map((w, i) => (
                                <div
                                    key={i}
                                    className={`h-6 w-${w} bg-slate-200 animate-pulse rounded-md`}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-row items-center gap-1 pt-1 overflow-x-auto no-scrollbar">
                            {tabs.map((tab, idx) => {
                                const isCurrent = activeTab
                                    ? activeTab === tab
                                    : idx === 0;
                                return (
                                    <button
                                        key={tab}
                                        type="button"
                                        onClick={() => onTabChange?.(tab)}
                                        className={cn(
                                            'px-4 py-3 font-semibold text-[15px] rounded-t-md transition-colors whitespace-nowrap',
                                            isCurrent
                                                ? 'text-gray-900 border-b-[3px] border-gray-900'
                                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                        )}
                                    >
                                        {tab}
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {children}
            </div>
        </div>
    );
}
