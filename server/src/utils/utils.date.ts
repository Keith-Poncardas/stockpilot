/**
 * Utility functions for date manipulation
 */

export function getCurrentMonthMetrics() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysElapsed = now.getDate();

    return { now, startOfMonth, daysElapsed };
}

/**
 * Calculates the start and end dates for a trend period based on a given number of days.
 * @param days The number of days for the trend period
 * @returns { endOfToday: Date, trendStart: Date }
 */
export function getTrendDateRange(days: number) {
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const trendStart = new Date(endOfToday);
    trendStart.setDate(trendStart.getDate() - (days - 1));
    trendStart.setHours(0, 0, 0, 0);

    return { endOfToday, trendStart };
}
