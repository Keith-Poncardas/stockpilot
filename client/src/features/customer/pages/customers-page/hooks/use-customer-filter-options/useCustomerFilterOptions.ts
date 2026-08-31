import { useCallback, useMemo } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { ICustomerFilters, IUseCustomerFilterOptionsReturn } from './types';

export function useCustomerFilterOptions(
    filters: ICustomerFilters,
    setFilters: Dispatch<SetStateAction<ICustomerFilters>>
): IUseCustomerFilterOptionsReturn {
    const handleOrderByChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, orderBy: val }));
    }, [setFilters]);

    const handleOrderDirectionChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, orderDirection: val }));
    }, [setFilters]);

    const handleDateFromChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, dateFrom: val }));
    }, [setFilters]);

    const handleDateToChange = useCallback((val: string) => {
        setFilters(prev => ({ ...prev, dateTo: val }));
    }, [setFilters]);

    return useMemo(() => ({
        orderByFilter: filters.orderBy,
        setOrderByFilter: handleOrderByChange,
        orderDirectionFilter: filters.orderDirection,
        setOrderDirectionFilter: handleOrderDirectionChange,
        dateFrom: filters.dateFrom,
        setDateFrom: handleDateFromChange,
        dateTo: filters.dateTo,
        setDateTo: handleDateToChange,
    }), [
        filters.orderBy,
        filters.orderDirection,
        filters.dateFrom,
        filters.dateTo,
        handleOrderByChange,
        handleOrderDirectionChange,
        handleDateFromChange,
        handleDateToChange
    ]);
}
