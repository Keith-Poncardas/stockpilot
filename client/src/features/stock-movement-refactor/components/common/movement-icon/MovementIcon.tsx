import type { MovementType } from "@/features/stock-movement-refactor/types";
import { getMovementConfig } from "./utils";
import { MovementIconSkeleton } from "./MovementIconSkeleton";

/**
 * Renders a styled icon for the given stock movement type.
 */
export function MovementIcon({ type }: { type: MovementType }) {
    const { icon: Icon, className } = getMovementConfig(type);

    return (
        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${className}`}>
            <Icon className="w-4 h-4" />
        </span>
    );
}

MovementIcon.Skeleton = MovementIconSkeleton;
