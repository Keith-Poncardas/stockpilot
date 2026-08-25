import type { SaleRowProps } from '../../../sale.types';
import { formatSaleId } from '../../../sale.utils';

/**
 * Renders the human-readable Sale ID (e.g. SALE-A1B2C3).
 * Displays in monospace to keep alignment consistent, matching the
 * SKU cell pattern used in the Product table.
 */
export function SaleIdCell({ row }: SaleRowProps) {
    const displayId = formatSaleId(row.original.id);

    return (
        <span
            className="text-xs text-gray-500 font-medium tracking-wide"
            style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}
            title={row.original.id}
        >
            {displayId}
        </span>
    );
};
