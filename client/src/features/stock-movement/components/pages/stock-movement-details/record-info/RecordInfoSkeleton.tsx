import { RecordInfoLayout } from "./RecordInfoLayout";

/**
 * Skeleton component for the RecordInfo section.
 * Displays a loading state with pulse animations matching the layout of the actual record info.
 *
 * @returns {JSX.Element} The rendered skeleton component.
 */
export function RecordInfoSkeleton() {
    return (
        <RecordInfoLayout>
            <dl className="space-y-3">
                <div>
                    <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mb-1.5" />
                    <div className="h-5 w-40 bg-slate-100 animate-pulse rounded" />
                </div>
                <div>
                    <div className="h-3 w-28 bg-slate-100 animate-pulse rounded mb-1.5" />
                    <div className="h-5 w-32 bg-slate-100 animate-pulse rounded" />
                </div>
                <div>
                    <div className="h-3 w-20 bg-slate-100 animate-pulse rounded mb-1.5" />
                    <div className="h-4 w-full bg-slate-100 animate-pulse rounded" />
                </div>
            </dl>
        </RecordInfoLayout>
    );
}
