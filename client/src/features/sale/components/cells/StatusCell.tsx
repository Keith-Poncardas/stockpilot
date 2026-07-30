import { AVAILABLE_STATUSES, SaleStatus } from "../../sale.constants";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { CHANGE_SALE_STATUS, GET_SALE_METRICS } from "../../operations";
import { getOptions } from "@/features/user/user.utils";
import { getSaleStatusColor } from "../../sale.utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "@/features/user/components/cells/ActionCellContent";

import type { SaleRowProps } from "../../sale.types";

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

    const statusOptions = getOptions({
        items: AVAILABLE_STATUSES,
        currentValue: status,
        getValue: (s) => s.a,
        getLabel: (s) => s.b,
        getColor: (s) => getSaleStatusColor(s.a),
        onUpdate: handleUpdate as (value: string) => void,
    });

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
