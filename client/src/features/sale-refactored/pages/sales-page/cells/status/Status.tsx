import { SaleStatus, SALE_STATUS_LABELS, SALE_STATUS_COLORS } from "../../../../constants";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { CHANGE_SALE_STATUS, GET_SALE_METRICS } from "../../../../operations";
import { getOptions } from "@/features/user/user.utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "@/components/common/action-cell-content/ActionCellContent";
import { useMemo } from "react";
import type { SaleCellProps } from "../cells.types";

/**
 * Renders the interactive sale status cell in the table.
 * Allows users to update the status via a popover (if not VOIDED or REFUNDED)
 * and utilizes optimistic mutations for immediate UI feedback.
 */
export function StatusCell({ row }: SaleCellProps) {
    const { mutate } = useOptimisticMutation();
    const { status, id } = row.original;

    const isStatusDisabled = status === SaleStatus.VOIDED || status === SaleStatus.REFUNDED;

    const handleUpdate = async (newStatus: string) => {
        await mutate({
            mutation: CHANGE_SALE_STATUS,
            typename: "SaleListItem",
            entityId: id,
            optimisticFields: {
                status: newStatus,
            },
            buildVariables: ({ status }) => ({
                input: { saleId: id, status }
            }),
            refetchQueries: [GET_SALE_METRICS]
        });
    };

    const statusOptions = useMemo(() => getOptions({
        items: Object.values(SaleStatus),
        currentValue: status,
        getValue: (s) => s,
        labelConfig: SALE_STATUS_LABELS,
        colorConfig: SALE_STATUS_COLORS,
        onUpdate: handleUpdate,
    }), [status, handleUpdate]);

    return (
        <ActionPopover
            title="Update Status"
            options={statusOptions}
            disabled={isStatusDisabled}
        >
            <ActionCellContent
                label={status}
                approvalStatus=""
                isLocked={isStatusDisabled}
                withBorder={false}
            />
        </ActionPopover>
    );
}
