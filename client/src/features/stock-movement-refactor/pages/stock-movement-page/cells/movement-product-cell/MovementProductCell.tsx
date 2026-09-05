import { useState } from "react";
import { Package, Barcode, ArrowDown, ArrowUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { getOptimizedImageUrl } from "@/lib/cloudinary";
import { useViewProductSheet } from "@/features/product/components/view-product-sheet";
import type { MovementProductCellProps } from "./types";

const FallbackText = ({ text }: { text: string }) => (
    <span className="italic text-slate-400">{text}</span>
);

/**
 * Renders the primary product entity cell for a stock movement.
 * Includes a modern avatar thumbnail displaying product image (or package icon fallback),
 * directional movement badge (IN/OUT/ADJUSTMENT), bold product title, and a monospace SKU pill.
 */
export function MovementProductCell({
    type,
    product,
    onClick,
    enableViewSheet = true,
}: MovementProductCellProps) {
    const { onOpen: openViewProductSheet } = useViewProductSheet();
    const [imageError, setImageError] = useState(false);

    const productId = product?.id;
    const canView = Boolean(enableViewSheet && productId);
    const isClickable = Boolean(onClick || canView);

    const handleClick = (e: React.MouseEvent) => {
        if (onClick) {
            onClick();
            return;
        }
        if (canView && productId) {
            e.stopPropagation();
            openViewProductSheet(productId);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isClickable) return;
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
        }
    };

    const hasImage = Boolean(product?.imageUrl) && !imageError;
    const optimizedImage = hasImage && product.imageUrl
        ? getOptimizedImageUrl(product.imageUrl, { width: 88, height: 88, crop: "fill" })
        : null;

    return (
        <div
            className={cn(
                "flex items-center gap-3.5 py-1.5 group min-w-0 text-left select-none",
                isClickable && "cursor-pointer"
            )}
            onClick={isClickable ? handleClick : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            title={canView ? `View product details for ${product.name}` : undefined}
        >
            {/* Thumbnail container with directional movement badge */}
            <div className="relative shrink-0">
                <div
                    className={cn(
                        "w-10 h-10 rounded-lg border border-slate-200/90 bg-gradient-to-br from-slate-50 to-slate-100/90 flex items-center justify-center overflow-hidden shadow-2xs transition-all",
                        isClickable && "group-hover:border-blue-400/80 group-hover:shadow-xs"
                    )}
                >
                    {optimizedImage ? (
                        <img
                            src={optimizedImage}
                            alt={product.name}
                            className={cn(
                                "w-full h-full object-cover transition-transform duration-200",
                                isClickable && "group-hover:scale-105"
                            )}
                            onError={() => setImageError(true)}
                            loading="lazy"
                        />
                    ) : (
                        <Package
                            className={cn(
                                "w-5 h-5 text-slate-400 transition-colors",
                                isClickable && "group-hover:text-slate-600"
                            )}
                            strokeWidth={1.75}
                        />
                    )}
                </div>

                {/* Sub-badge indicating IN/OUT/ADJUSTMENT */}
                <span
                    className={cn(
                        "absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs z-10",
                        type === "IN" && "bg-emerald-500 text-white",
                        type === "OUT" && "bg-rose-500 text-white",
                        type === "ADJUSTMENT" && "bg-purple-500 text-white"
                    )}
                    title={`Type: ${type}`}
                >
                    {type === "IN" && <ArrowDown className="w-2.5 h-2.5 stroke-[2.5]" />}
                    {type === "OUT" && <ArrowUp className="w-2.5 h-2.5 stroke-[2.5]" />}
                    {type === "ADJUSTMENT" && <RefreshCw className="w-2.5 h-2.5 stroke-[2.5]" />}
                </span>
            </div>

            {/* Product Name & SKU */}
            <div className="flex flex-col min-w-0 max-w-[270px]">
                <span
                    className={cn(
                        "text-sm font-semibold text-slate-900 leading-snug break-words whitespace-normal transition-colors",
                        isClickable && "group-hover:text-blue-600"
                    )}
                    title={product.name}
                >
                    {product.name || <FallbackText text="No description" />}
                </span>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    {product.sku ? (
                        <span className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 font-medium bg-slate-100/90 px-1.5 py-0.5 rounded border border-slate-200/70 shadow-2xs">
                            <Barcode className="w-3 h-3 text-slate-400 shrink-0" />
                            {product.sku}
                        </span>
                    ) : (
                        <FallbackText text="No SKU" />
                    )}
                </div>
            </div>
        </div>
    );
}

