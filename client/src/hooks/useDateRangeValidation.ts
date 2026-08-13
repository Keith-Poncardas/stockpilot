import { useMemo } from 'react';

interface UseDateRangeValidationOptions {
    errorMessage?: string;
}

export function useDateRangeValidation(
    dateFrom: string | Date | null | undefined,
    dateTo: string | Date | null | undefined,
    options?: UseDateRangeValidationOptions
) {
    const { errorMessage = "Start Date must be before or equal to End Date" } = options || {};

    return useMemo(() => {
        if (!dateFrom || !dateTo) {
            return { dateError: null, dateFrom, dateTo };
        }

        const start = new Date(dateFrom);
        const end = new Date(dateTo);

        if (start > end) {
            return { dateError: errorMessage, dateFrom: undefined, dateTo: undefined };
        }

        return { dateError: null, dateFrom, dateTo };
    }, [dateFrom, dateTo, errorMessage]);
}
