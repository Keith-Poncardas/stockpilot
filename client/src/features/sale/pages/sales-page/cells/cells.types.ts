import type { Row } from "@tanstack/react-table";


/**
 * Common props for sale table cells
 */
export interface SaleCellProps<T = any> {
    row: Row<T>;
};

