
import { Filter, Calendar } from 'lucide-react';
import { SelectFilter } from '@/components/ui/select-filter';
import { DatePicker } from '@/components/ui/date-picker';
import type { DatePickerConfigItem } from '../date-picker-config/types';
import type { PopoverConfigItem } from './types';

/**
 * Builds the sales data table filter popovers configuration.
 * 
 * @param {any[]} filterOptions - List of selection filters (status, payment method, order by, direction).
 * @param {DatePickerConfigItem[]} datePickers - List of date pickers configuration.
 * @param {string | null} dateError - Active error message related to date validation.
 * @returns {PopoverConfigItem[]} Configured popover filters.
 */
export function buildSaleFilter(
    filterOptions: any[],
    datePickers: DatePickerConfigItem[],
    dateError: string | null
): PopoverConfigItem[] {
    return [
        {
            title: "Status & Sort",
            description: "Filter sales by status, payment and sort order.",
            icon: Filter,
            contentClassName: "w-96 p-4",
            children: (
                <div className="grid grid-cols-2 gap-3">
                    {filterOptions.map((filter, idx) => (
                        <SelectFilter
                            key={idx}
                            value={filter.value}
                            onChange={filter.onChange}
                            options={filter.options}
                            defaultValue={filter.defaultValue}
                            className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                        />
                    ))}
                </div>
            )
        },
        {
            title: "Date Range",
            description: "Filter sales by transaction date.",
            icon: Calendar,
            contentClassName: "w-80 p-4",
            children: (
                <>
                    <div className="grid grid-cols-2 gap-2 items-center">
                        {datePickers.map((dp, idx) => (
                            <DatePicker
                                key={idx}
                                value={dp.value}
                                onChange={dp.onChange}
                                placeholder={dp.placeholder}
                                className="w-full h-8 text-xs lg:h-9 lg:text-sm border-slate-200"
                            />
                        ))}
                    </div>
                    {dateError && <p className="text-xs text-red-500 font-medium mt-1">{dateError}</p>}
                </>
            )
        }
    ];
}