import * as React from "react";
import { Calendar, Clock } from "lucide-react";
import { cn, formatDate, formatTime, parseDate } from "@/lib/utils";

export interface DateTimeCellProps {
    /** The date value to display (ISO string, timestamp number, or Date) */
    date?: string | number | Date | null;
    /** Alternative prop for value when used with TanStack Table cell renderers */
    value?: string | number | Date | null;
    /** Whether to display the time below the date. Default: true */
    showTime?: boolean;
    /** Whether to display icons (Calendar, Clock). Default: true */
    showIcon?: boolean;
    /** Additional CSS classes for root container */
    className?: string;
    /** Fallback text or element when date is null/undefined or invalid. Default: "—" */
    fallback?: React.ReactNode;
}

export function DateTimeCell({
    date,
    value,
    showTime = true,
    showIcon = true,
    className,
    fallback = <span className="text-xs text-slate-400 dark:text-zinc-500 font-mono italic">—</span>,
}: DateTimeCellProps) {
    const targetDate = date ?? value;

    if (!targetDate) {
        return <>{fallback}</>;
    }

    let dateStr: string;
    let timeStr = "";

    try {
        const parsed = parseDate(targetDate);
        dateStr = formatDate(parsed);
        if (showTime) {
            timeStr = formatTime(parsed);
        }
    } catch {
        return <>{fallback}</>;
    }

    return (
        <div className={cn("flex flex-col text-left py-0.5", className)}>
            <span className="text-xs font-semibold text-slate-800 dark:text-zinc-200 flex items-center gap-1.5 whitespace-nowrap">
                {showIcon && <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />}
                {dateStr}
            </span>
            {showTime && timeStr && (
                <span className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono flex items-center gap-1.5 mt-0.5 whitespace-nowrap">
                    {showIcon && <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 shrink-0" />}
                    {timeStr}
                </span>
            )}
        </div>
    );
}

export default DateTimeCell;
