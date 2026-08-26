import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export interface BaseSheetLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description: string;
    icon: React.ElementType;
    children: React.ReactNode;
    className?: string;
    onOpenAutoFocus?: (e: Event) => void;
    footer?: React.ReactNode;
    footerClassName?: string;
}

export function BaseSheetLayout({
    isOpen,
    onClose,
    title,
    description,
    icon: Icon,
    children,
    className,
    onOpenAutoFocus,
    footer,
    footerClassName,
}: BaseSheetLayoutProps) {
    return (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <SheetContent
                side="right"
                className={className || "w-[95vw]! sm:max-w-xl! md:max-w-2xl! lg:max-w-3xl! flex flex-col gap-0 p-0"}
                onOpenAutoFocus={onOpenAutoFocus}
            >
                <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-row items-center gap-4 text-left">
                    <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex flex-col gap-1">
                        <SheetTitle>{title}</SheetTitle>
                        <SheetDescription>{description}</SheetDescription>
                    </div>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
                {footer && (
                    <div className={cn("px-4 sm:px-6 py-4 border-t border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex items-center justify-end gap-3 sticky bottom-0 z-10 shrink-0", footerClassName)}>
                        {footer}
                    </div>
                )}
            </SheetContent>
        </Sheet>
    );
}

