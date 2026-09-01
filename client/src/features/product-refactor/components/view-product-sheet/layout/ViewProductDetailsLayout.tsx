import type { ReactNode } from 'react';

interface ViewProductDetailsLayoutProps {
    metrics?: ReactNode;
    mainContent: ReactNode;
    sidebarContent: ReactNode;
    actions?: ReactNode;
}

export function ViewProductDetailsLayout({
    metrics,
    mainContent,
    sidebarContent,
    actions,
}: ViewProductDetailsLayoutProps) {
    return (
        <div className="flex flex-col min-h-0 h-full">
            <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 bg-slate-50/50">
                <div className="flex flex-col gap-6 w-full mx-auto">
                    {metrics}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Main Content (2 columns on lg) */}
                        <div className="lg:col-span-2 flex flex-col gap-6 min-w-0 w-full">
                            {mainContent}
                        </div>

                        {/* Sidebar Content (1 column on lg) */}
                        <div className="flex flex-col gap-6 w-full shrink-0">
                            {sidebarContent}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Actions Footer */}
            {actions && (
                <div className="px-4 sm:px-6 py-4 border-t border-slate-200 bg-white flex items-center gap-3 sticky bottom-0 z-10 shrink-0">
                    {actions}
                </div>
            )}
        </div>
    );
}
