import { MovementIcon } from "../../common";
import type { MovementProductCellProps } from "./types";

const FallbackText = ({ text }: { text: string }) => (
    <span className="italic text-[#9C9A91]">{text}</span>
);

/**
 * Renders the product details for a stock movement along with its corresponding movement type icon.
 * Displays the product name and SKU, falling back to placeholder text if either is missing.
 *
 * @param props - The component properties.
 * @param props.type - The type of stock movement (e.g., 'IN', 'OUT', 'ADJUSTMENT').
 * @param props.product - The product details containing name and SKU.
 * @returns A React element containing the movement icon and product details.
 */
export function MovementProductCell({
    type,
    product
}: MovementProductCellProps) {
    return (
        <div className="flex items-center gap-3 min-w-0">
            <MovementIcon type={type} />
            <div className="min-w-0">
                <p className="text-sm font-bold truncate">
                    {product.name || <FallbackText text="No description" />}
                </p>
                <p className="text-xs text-[#9C9A91] font-mono truncate">
                    {product.sku || <FallbackText text="No SKU" />}
                </p>
            </div>
        </div>
    );
};