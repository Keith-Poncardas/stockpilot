import { useMemo } from 'react';
import { ProductStatus, PRODUCT_STATUS_LABELS, PRODUCT_STATUS_COLORS } from '../../../../constants';
import { useOptimisticMutation } from '@/hooks/useOptimisticMutation';
import { CHANGE_PRODUCT_STATUS, GET_PRODUCT_METRICS } from '../../../../operations';
import { getOptions } from '@/features/user/user.utils';
import ActionPopover from '@/components/ActionPopover';
import { ActionCellContent } from '@/components/common/action-cell-content/ActionCellContent';
import type { ProductRowInfoCellProps, ProductStatus as ProductStatusType } from '../../../../types';

export function StatusCell({ row }: ProductRowInfoCellProps) {
    const { mutate } = useOptimisticMutation<
        { input: { productId: string; status: ProductStatusType } },
        { status: ProductStatusType }
    >();
    const { status, id } = row.original;

    const isStatusDisabled = status === ProductStatus.DISCONTINUED;

    const handleUpdate = async (newStatus: string) => {
        await mutate({
            mutation: CHANGE_PRODUCT_STATUS,
            typename: 'Product',
            entityId: id,
            optimisticFields: {
                status: newStatus as ProductStatusType,
            },
            buildVariables: ({ status }) => ({
                input: { productId: id, status },
            }),
            refetchQueries: [GET_PRODUCT_METRICS],
        });
    };

    const statusOptions = useMemo(
        () =>
            getOptions({
                items: Object.values(ProductStatus),
                currentValue: status,
                getValue: (s) => s,
                labelConfig: PRODUCT_STATUS_LABELS,
                colorConfig: PRODUCT_STATUS_COLORS,
                onUpdate: handleUpdate,
            }),
        [status, handleUpdate]
    );

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
