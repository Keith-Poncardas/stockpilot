import type { ISaleFilters } from "../../types";
import type { DatePickerConfigItem } from "./types";

/**
 * Builds the date picker configuration for start and end dates.
 * 
 * @param {ISaleFilters} filters - The current sales active filters state.
 * @param {(val: string | undefined) => void} handleDateFromChange - Callback when start date changes.
 * @param {(val: string | undefined) => void} handleDateToChange - Callback when end date changes.
 * @returns {DatePickerConfigItem[]} The array of date picker items configurations.
 */
export function buildDatePicker(
    filters: ISaleFilters,
    handleDateFromChange: (val: string | undefined) => void,
    handleDateToChange: (val: string | undefined) => void
): DatePickerConfigItem[] {
    return [
        {
            value: filters.dateFrom,
            onChange: handleDateFromChange,
            placeholder: "Start Date"
        },
        {
            value: filters.dateTo,
            onChange: handleDateToChange,
            placeholder: "End Date"
        }
    ];
};