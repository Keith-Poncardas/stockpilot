import { Button } from "@/components/ui/button";
import type { IProduct } from "@/features/product/product.types";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ReactNode } from "react";

const statusStyles: Record<string, { badge: string; dot: string }> = {
    ACTIVE: { badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20', dot: 'bg-emerald-400' },
    INACTIVE: { badge: 'bg-gray-500/15 text-gray-400 border-gray-500/20', dot: 'bg-gray-400' },
    DISCONTINUED: { badge: 'bg-red-500/15 text-red-400 border-red-500/20', dot: 'bg-red-400' },
    DRAFT: { badge: 'bg-amber-500/15 text-amber-400 border-amber-500/20', dot: 'bg-amber-400' },
    ARCHIVED: { badge: 'bg-slate-500/15 text-slate-400 border-slate-500/20', dot: 'bg-slate-400' },
};

interface HeaderProps {
    title: string;
    subtitle?: string;
    status?: IProduct['status'];
    /** Renders a back-chevron button. Default: true */
    showBackButton?: boolean;
    /** Makes the header sticky at the top of the viewport. Default: false */
    sticky?: boolean;
    /** Action buttons rendered on the right side */
    actions?: ReactNode;
}

export function Header({
    title,
    subtitle,
    status: productStatus,
    showBackButton = true,
    sticky = false,
    actions,
}: HeaderProps) {
    const navigate = useNavigate();

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <header
            className={[
                "bg-gray-900 text-white shadow-sm rounded-lg py-2",
                sticky ? "sticky top-0 z-30" : "rounded-lg py-3",
            ]
                .filter(Boolean)
                .join(" ")}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <Button
                                variant="glass"
                                size="icon-lg"
                                className="hidden sm:flex rounded-full"
                                onClick={handleBack}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        )}
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-tight">
                                    {title}
                                </h1>
                                {productStatus && (() => {
                                    const s = statusStyles[productStatus] ?? statusStyles['INACTIVE'];
                                    return (
                                        <span className={`inline-flex items-center gap-1.5 rounded-full text-xs font-semibold px-2.5 py-1 border ${s.badge}`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                                            {productStatus}
                                        </span>
                                    );
                                })()}
                            </div>
                            {subtitle && (
                                <p className="text-slate-400 text-sm mt-1 font-mono">
                                    <span className="font-bold">{subtitle}</span>
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="hidden sm:flex items-center gap-2 shrink-0">
                            {actions}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

Header.Skeleton = function HeaderSkeleton() {
    return (
        <header className="bg-gray-900 text-white rounded-2xl py-3 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="glass"
                            size="icon-lg"
                            className="hidden sm:flex rounded-full opacity-50"
                            disabled
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <div>
                            <div className="flex items-center gap-3 flex-wrap">
                                <div className="h-8 w-48 bg-gray-700/50 animate-pulse rounded-md" />
                                <div className="h-6 w-24 bg-gray-700/50 animate-pulse rounded-full" />
                            </div>
                            <div className="mt-1 h-5 w-32 bg-gray-700/50 animate-pulse rounded-md" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="h-9 w-32 bg-gray-700/50 animate-pulse rounded-md" />
                        <div className="h-9 w-28 bg-gray-700/50 animate-pulse rounded-md" />
                        <div className="h-9 w-28 bg-gray-700/50 animate-pulse rounded-md" />
                    </div>
                </div>
            </div>
        </header>
    );
};
