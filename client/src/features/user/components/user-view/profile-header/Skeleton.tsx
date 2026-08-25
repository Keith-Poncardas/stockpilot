/**
 * Skeleton loading state for the UserProfileHeader component.
 * 
 * Displays a placeholder UI with pulsing animations while the user data is being fetched,
 * matching the layout structure of the actual UserProfileHeader.
 * 
 * @returns {JSX.Element} The loading skeleton UI
 */
export function Skeleton() {
    return (
        <>
            <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6 relative z-10">
                <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white bg-slate-300 animate-pulse shrink-0 mx-auto md:mx-0"></div>
                <div className="flex flex-col items-center md:items-start md:mb-4 w-full md:w-auto">
                    <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-md mb-2"></div>
                    <div className="h-4 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                </div>
            </div>

            <div className="flex flex-row items-center justify-center md:justify-start gap-2 md:mb-4 relative z-10 flex-wrap">
                <div className="h-9 w-28 bg-slate-200 animate-pulse rounded-md"></div>
                <div className="h-9 w-32 bg-slate-200 animate-pulse rounded-md"></div>
                <div className="h-9 w-12 bg-slate-200 animate-pulse rounded-md"></div>
            </div>
        </>
    )
};