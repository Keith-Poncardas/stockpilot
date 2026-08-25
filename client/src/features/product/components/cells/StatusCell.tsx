import { AVAILABLE_STATUSES, ProductStatus } from "@/features/product/product.constants";
import { useOptimisticMutation } from "@/hooks/useOptimisticMutation";
import { CHANGE_PRODUCT_STATUS, GET_PRODUCT_METRICS } from "../../operations";
import { getOptions } from "@/features/user/user.utils";
import { getProductStatusColor } from "../../product.utils";
import ActionPopover from "@/components/ActionPopover";
import { ActionCellContent } from "@/components/common/action-cell-content/ActionCellContent";

import type { ProductRowInfoCellProps } from "../../product.types";

export function StatusCell({ row }: ProductRowInfoCellProps) {
    const { mutate } = useOptimisticMutation();
    const { status, id } = row.original;

    const isStatusDisabled = status === ProductStatus.DISCONTINUED.a;

    const handleUpdate = async (newStatus: ProductStatus) => {
        await mutate({
            mutation: CHANGE_PRODUCT_STATUS,
            typename: 'Product',
            entityId: id,
            optimisticFields: {
                status: newStatus,
            },
            buildVariables: ({ status }) => ({
                input: { productId: id, status }
            }),
            refetchQueries: [GET_PRODUCT_METRICS]
        });
    }

    const statusOptions = getOptions({
        items: AVAILABLE_STATUSES,
        currentValue: status,
        getValue: (s) => s.a,
        getLabel: (s) => s.b,
        getColor: (s) => getProductStatusColor(s.a),
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
    )
}
