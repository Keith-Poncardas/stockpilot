import { memo } from "react";
import { getConfigColor, cn, formatNumber } from "@/lib/utils";
import { IN_OUT_QUANTITY_COLORS } from "../../../sm.config";
import { getQuantityPrefix } from "./utils";
import type { QuantityDisplayProps } from "./types";

/**
 * Renders the quantity of a stock movement formatted with an appropriate sign prefix
 * (+ for IN, - for OUT, and no prefix for ADJUSTMENT) and styled with the corresponding color.
 *
 * @param {QuantityDisplayProps} props - The component properties.
 * @param {number} props.quantity - The movement quantity to display.
 * @param {MovementType} props.type - The type of movement (IN, OUT, ADJUSTMENT).
 * @returns {JSX.Element} The rendered quantity display component.
 */
export const QuantityDisplay = memo(({ quantity, type }: QuantityDisplayProps) => {
    const prefix = getQuantityPrefix(type);
    const formattedQuantity = formatNumber(quantity);

    return (
        <div className={cn(
            "text-center font-mono text-sm font-semibold",
            getConfigColor(IN_OUT_QUANTITY_COLORS, type)
        )}>
            {`${prefix}${formattedQuantity}`}
        </div>
    );
});
