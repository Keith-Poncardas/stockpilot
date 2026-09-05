import { MovementSummaryLayout } from './MovementSummaryLayout';

export function MovementSummarySkeleton() {
    return (
        <MovementSummaryLayout>
            <div className="flex items-start gap-4 my-3">
                <div className="h-12 w-12 rounded-lg bg-slate-100 animate-pulse shrink-0" />
                <div className="flex-1">
                    <div className="h-8 w-32 bg-slate-100 animate-pulse rounded mb-1.5" />
                    <div className="h-5 w-48 bg-slate-100 animate-pulse rounded" />
                </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div>
                    <div className="h-3 w-16 bg-slate-100 animate-pulse rounded mb-1" />
                    <div className="h-6 w-20 bg-slate-100 animate-pulse rounded" />
                </div>
                <div>
                    <div className="h-3 w-28 bg-slate-100 animate-pulse rounded mb-1" />
                    <div className="h-6 w-24 bg-slate-100 animate-pulse rounded" />
                </div>
                <div>
                    <div className="h-3 w-10 bg-slate-100 animate-pulse rounded mb-1" />
                    <div className="h-6 w-16 bg-slate-100 animate-pulse rounded" />
                </div>
            </dl>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="h-3 w-12 bg-slate-100 animate-pulse rounded mb-1.5" />
                <div className="h-6 w-full bg-slate-100 animate-pulse rounded" />
            </div>
        </MovementSummaryLayout>
    );
}
