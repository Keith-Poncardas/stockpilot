import type { ISaleDetails } from "@/features/sale-refactored/types";
import type { Row } from "@tanstack/react-table";

/**
 * Common props for sale table cells
 */
export interface SaleCellProps {
    row: Row<ISaleDetails>;
};