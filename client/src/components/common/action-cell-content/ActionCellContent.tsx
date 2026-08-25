import { memo } from "react";
import { cn, getConfigColor } from "@/lib/utils";
import { Lock } from "lucide-react";
import { APPROVAL_BORDER_COLORS } from "../../../features/user/user.config";
import type { ActionCellProps } from "./types";

/**
 * Renders the content of an action cell within a data table.
 * Displays a label and conditionally renders a lock icon if the action is disabled (locked).
 * Can optionally show a colored left border indicating the user's approval status.
 *
 * @param {ActionCellProps} props - The component props.
 * @param {string} props.label - The text label to display inside the cell.
 * @param {string} props.approvalStatus - The user's approval status, used to determine the color of the left border.
 * @param {boolean} props.isLocked - Indicates whether the cell action is disabled. If true, a lock icon is shown and the opacity is reduced.
 * @param {boolean} [props.withBorder=true] - Determines whether to display the colored left border based on the approval status.
 * @returns {JSX.Element} The rendered action cell content component.
 */
export const ActionCellContent = memo(function ActionCellContent({
    label,
    approvalStatus,
    isLocked,
    withBorder = true
}: ActionCellProps) {

    const borderLeftColor = getConfigColor(
        APPROVAL_BORDER_COLORS,
        approvalStatus
    );

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
            <span>{label}</span>
        </div>
    );
});
