import { useEffect } from 'react';
import { useDataTable } from '@/hooks/useDataTable';
import { useCustomerPurchaseHistoryColumns } from '../columns';
import type { ISale } from '@/features/sale/types';
import type { ICustomerSale } from '@/features/customer';

interface UseCustomerPurchaseHistoryOptions {
    sales?: (ISale | ICustomerSale)[];
    isLoading?: boolean;
}

export function useCustomerPurchaseHistory({
    sales = [],
    isLoading = false,
}: UseCustomerPurchaseHistoryOptions) {
    const columns = useCustomerPurchaseHistoryColumns();

    const { table, pagination, setQueryData } = useDataTable<ISale | ICustomerSale, any>({
        columns,
        initialPageSize: 5,
    });

    useEffect(() => {
        const totalItems = sales?.length || 0;
        const pageSize = pagination.pageSize || 5;
        const totalPages = Math.ceil(totalItems / pageSize) || 1;
        const pageIndex = pagination.pageIndex || 0;
        const slicedData = (sales || []).slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

        setQueryData({
            data: slicedData,
            meta: {
                totalPages,
                totalItems,
            },
        });
    }, [sales, pagination.pageIndex, pagination.pageSize, setQueryData]);

    const isEmpty = !isLoading && (sales?.length || 0) === 0;

    return {
        table,
        isLoading,
        isEmpty,
    };
}
