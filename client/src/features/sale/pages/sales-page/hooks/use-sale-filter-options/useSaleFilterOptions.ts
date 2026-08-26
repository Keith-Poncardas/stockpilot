import type { ISaleFilters } from "@/features/sale/components";
import { useCallback, useMemo } from "react";
import {
    paymentMethodOptions,
    saleOrderByOptions,
    saleOrderDirectionOptions,
    saleStatusOptions
} from "./sale.filter.options";

/**
 * React hook that returns optimized and memoized filter options.
 * This prevents unnecessary re-renders of child components by keeping
 * handler references and the options array stable across renders.
 */
export const useSaleFilterOptions = (
    filters: ISaleFilters,
    setFilters: React.Dispatch<React.SetStateAction<ISaleFilters>>
) => {
    const handleStatusChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, status: val }));
    }, [setFilters]);

    const handlePaymentMethodChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, paymentMethod: val }));
    }, [setFilters]);

    const handleOrderByChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, orderBy: val }));
    }, [setFilters]);

    const handleOrderDirectionChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, orderDirection: val }));
    }, [setFilters]);

    return useMemo(() => [
        {
            value: filters.status,
            onChange: handleStatusChange,
            options: saleStatusOptions,
            defaultValue: saleStatusOptions[0].value
        },
        {
            value: filters.paymentMethod,
            onChange: handlePaymentMethodChange,
            options: paymentMethodOptions,
            defaultValue: paymentMethodOptions[0].value
        },
        {
            value: filters.orderBy,
            onChange: handleOrderByChange,
            options: saleOrderByOptions,
            defaultValue: saleOrderByOptions[0].value
        },
        {
            value: filters.orderDirection,
            onChange: handleOrderDirectionChange,
            options: saleOrderDirectionOptions,
            defaultValue: saleOrderDirectionOptions[0].value
        }
    ], [
        filters.status,
        filters.paymentMethod,
        filters.orderBy,
        filters.orderDirection,
        handleStatusChange,
        handlePaymentMethodChange,
        handleOrderByChange,
        handleOrderDirectionChange
    ]);
};
