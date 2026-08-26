import type { SaleCellProps } from "../cells.types";
import { UserInfoCell } from "@/components";
import { useViewCustomerSheet } from "@/features/customer-refactor";

/**
 * Renders the Customer UserInfoCell in the Sales Table.
 * Triggers the ViewCustomerSheet when clicked.
 */
export function CustomerCell({ row }: SaleCellProps) {
    const { onOpen } = useViewCustomerSheet();
    const customer = row.original.customer;
    const isWalkIn = !customer?.id;

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (customer?.id) {
            onOpen(customer.id);
        }
    };

    return (
        <UserInfoCell
            user={customer}
            type="customer"
            isLink={false}
            onClick={!isWalkIn ? handleClick : undefined}
            className={!isWalkIn ? "cursor-pointer hover:opacity-80 transition-opacity" : undefined}
        />
    );
}
