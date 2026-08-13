import { memo } from "react";
import { APPROVAL_BORDER_COLORS } from "@/config/colors";
import { cn } from "@/lib/utils";
import { Lock } from "lucide-react";

interface ActionCellProps {
    label: string;
    approvalStatus: string;
    isLocked: boolean;
    withBorder?: boolean;
}

export const ActionCellContent = memo(function ActionCellContent({
    label,
    approvalStatus,
    isLocked,
    withBorder = true
}: ActionCellProps) {

    const borderLeftColor = APPROVAL_BORDER_COLORS[approvalStatus] || APPROVAL_BORDER_COLORS.DEFAULT;
    const displayLabel = label ? label.replace(/_/g, ' ') : '';

    return (
        <div className={cn(
            "flex items-center justify-center gap-1.5 px-4 py-3 h-full",
            withBorder && [
                "relative w-full before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1/2 before:rounded-r-[3px]",
                borderLeftColor
            ],
            isLocked && "opacity-50"
        )}>
            {isLocked && <Lock size={16} strokeWidth={2.1} />}
            <span>{displayLabel}</span>
        </div>
    );
});
