import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface FilterPopoverProps {
    title?: string;
    description?: string;
    icon?: React.ElementType;
    customTrigger?: ReactNode;
    customHeader?: ReactNode;
    children: ReactNode;
    contentClassName?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    align?: "start" | "center" | "end";
    noPadding?: boolean;
}

export function FilterPopover({
    title,
    description,
    icon: Icon,
    customTrigger,
    customHeader,
    children,
    contentClassName = "w-96 p-4",
    open,
    onOpenChange,
    align = "start",
    noPadding
}: FilterPopoverProps) {
    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                {customTrigger ? customTrigger : (
                    <Button variant="outline" size="icon" className="h-8 w-8 lg:h-9 lg:w-9 border-slate-200">
                        {Icon && <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={2} />}
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent className={contentClassName} align={align}>
                <div className={noPadding ? "" : "flex flex-col gap-4"}>
                    {customHeader ? customHeader : (
                        title && (
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <h4 className="font-medium leading-none">{title}</h4>
                                    {description && (
                                        <p className="text-sm text-muted-foreground">
                                            {description}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                    {children}
                </div>
            </PopoverContent>
        </Popover>
    );
}
