import { AVAILABLE_STATUSES, SaleStatus } from "../../../sale.constants";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { CHANGE_SALE_STATUS, GET_SALE_METRICS } from "../../../operations";
import { getOptions } from "@/features/user/user.utils";
import { SALE_STATUS_COLORS, SALE_STATUS_LABELS } from "../../../sale.config";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "@/components/common/action-cell-content/ActionCellContent";
import { useMemo } from "react";

import type { SaleRowProps } from "../../../sale.types";

/**
 * Renders the interactive sale status cell in the table.
 * Allows users to update the status via a popover (if not VOIDED or REFUNDED)
 * and utilizes optimistic mutations for immediate UI feedback.
 *
 * @component
 * @param {SaleRowProps} props - The component props.
 * @param {Object} props.row - The table row containing the sale data.
 * @returns {React.ReactElement} The rendered StatusCell component.
 */
export function StatusCell({ row }: SaleRowProps) {
    const { mutate } = useOptimisticMutation();
    const { status, id } = row.original;

    const isStatusDisabled = status === SaleStatus.VOIDED.a || status === SaleStatus.REFUNDED.a;

    const handleUpdate = async (newStatus: SaleStatus) => {
        await mutate({
            mutation: CHANGE_SALE_STATUS,
            typename: 'SaleListItem',
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
        items: AVAILABLE_STATUSES,
        currentValue: status,
        getValue: (s) => s.a,
        labelConfig: SALE_STATUS_LABELS,
        colorConfig: SALE_STATUS_COLORS,
        onUpdate: handleUpdate as (value: string) => void,
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
