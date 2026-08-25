import { ArrowDown, ArrowUp, RefreshCw } from "lucide-react";

/**
 * Configuration for stock movement icons.
 */
export const MOVEMENT_CONFIG = {
    IN: { icon: ArrowDown, className: "bg-emerald-50 text-emerald-600" },
    OUT: { icon: ArrowUp, className: "bg-rose-50 text-rose-600" },
    ADJUSTMENT: { icon: RefreshCw, className: "bg-amber-50 text-amber-600" },
} as const;