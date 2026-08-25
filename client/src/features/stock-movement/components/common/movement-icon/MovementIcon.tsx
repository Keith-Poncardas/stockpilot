
import type { MovementType } from "@/features/stock-movement/types";
import { getMovementConfig } from "./utils";
import { MovementIconSkeleton } from "./MovementIconSkeleton";

/**
 * Renders an icon corresponding to a specific stock movement type.
 * 
 * @param props - The component properties.
 * @param props.type - The type of stock movement (e.g., 'IN', 'OUT', 'ADJUSTMENT').
 * @returns A React element containing the styled movement icon.
 */
export function MovementIcon({ type }: { type: MovementType }) {
    const { icon: Icon, className } = getMovementConfig(type);

    return (
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${className}`}>
            <Icon className="w-4 h-4" />
        </span>
    );
};

MovementIcon.Skeleton = MovementIconSkeleton;