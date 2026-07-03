import * as React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { EllipsisVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface ActionCellProps {
    children: React.ReactNode
    trigger?: React.ReactNode
    side?: "top" | "right" | "bottom" | "left"
    align?: "start" | "center" | "end"
    contentClassName?: string
}

export function ActionCell({
    children,
    trigger,
    side = "bottom",
    align = "end",
    contentClassName,
}: ActionCellProps) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                {trigger ?? (
                    <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-gray-400 hover:text-gray-700"
                    >
                        <EllipsisVertical className="h-4 w-4" />
                    </Button>
                )}
            </PopoverTrigger>
            <PopoverContent
                side={side}
                align={align}
                className={cn("w-40 p-1.5", contentClassName)}
            >
                {children}
            </PopoverContent>
        </Popover>
    )
}
