import { createContext, useContext, useState, type ReactNode, useCallback } from "react";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";

export interface SheetOptions {
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
                    className={options?.className || "w-[95vw] sm:max-w-md overflow-y-auto"}
                >
                    {options?.content}
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
