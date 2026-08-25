import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

export interface SheetOptions {
    title?: string;
    description?: string;
    icon?: React.ElementType;
    content: ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    className?: string;
}

interface SheetContextType {
    isOpen: boolean;
    options: SheetOptions | null;
    openSheet: (options: SheetOptions) => void;
    closeSheet: () => void;
}

const SheetContext = createContext<SheetContextType | undefined>(undefined);

export function SheetProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [options, setOptions] = useState<SheetOptions | null>(null);

    const openSheet = useCallback((newOptions: SheetOptions) => {
        setOptions(newOptions);
        setIsOpen(true);
    }, []);

    const closeSheet = useCallback(() => {
        setIsOpen(false);
        // Delay clearing options to allow exit animation to play smoothly
        setTimeout(() => setOptions(null), 300);
    }, []);

    const handleOpenChange = useCallback((open: boolean) => {
        if (!open) {
            closeSheet();
        } else {
            setIsOpen(true);
        }
    }, [closeSheet]);

    return (
        <SheetContext.Provider value={{ isOpen, options, openSheet, closeSheet }}>
            {children}

            <Sheet open={isOpen} onOpenChange={handleOpenChange}>
                <SheetContent
                    side={options?.side || "right"}
                    className={options?.className || "w-[95vw]! sm:max-w-xl! md:max-w-2xl! lg:max-w-3xl! flex flex-col gap-0 p-0"}
                >
                    {(options?.title || options?.description) && (
                        <SheetHeader className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-row items-center gap-4">
                            {options.icon && (
                                <div className="flex shrink-0 h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400">
                                    <options.icon className="h-6 w-6" />
                                </div>
                            )}
                            <div className="flex flex-col gap-1">
                                {options.title && <SheetTitle>{options.title}</SheetTitle>}
                                {options.description && <SheetDescription>{options.description}</SheetDescription>}
                            </div>
                        </SheetHeader>
                    )}

                    <div className="flex-1 overflow-y-auto">
                        {options?.content}
                    </div>
                </SheetContent>
            </Sheet>
        </SheetContext.Provider>
    );
}

export function useSheet() {
    const context = useContext(SheetContext);
    if (context === undefined) {
        throw new Error("useSheet must be used within a SheetProvider");
    }
    return context;
}
