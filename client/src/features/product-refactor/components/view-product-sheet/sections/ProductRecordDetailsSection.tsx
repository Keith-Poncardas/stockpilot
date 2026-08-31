import { formatDate } from '@/lib/utils';

interface ProductRecordDetailsSectionProps {
    status: string;
    createdAt: string;
    updatedAt: string;
}

export function ProductRecordDetailsSection({
    status,
    createdAt,
    updatedAt,
}: ProductRecordDetailsSectionProps) {
    const formattedStatus = status.charAt(0) + status.slice(1).toLowerCase();

    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
            <h2 className="font-semibold text-base text-slate-800 mb-4">Record Details</h2>
            <dl className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Status</dt>
                    <dd className="font-medium text-slate-700">{formattedStatus}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Created</dt>
                    <dd className="font-medium text-slate-700">{formatDate(createdAt)}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-slate-400">Last Updated</dt>
                    <dd className="font-medium text-slate-700">{formatDate(updatedAt)}</dd>
                </div>
            </dl>
        </section>
    );
}

ProductRecordDetailsSection.Skeleton = function ProductRecordDetailsSectionSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs animate-pulse">
            <div className="h-5 w-32 bg-slate-200 rounded mb-4" />
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-0.5">
                    <div className="h-4 w-16 bg-slate-200 rounded" />
                    <div className="h-4 w-20 bg-slate-100 rounded" />
                </div>
                <div className="flex items-center justify-between py-0.5">
                    <div className="h-4 w-20 bg-slate-200 rounded" />
                    <div className="h-4 w-24 bg-slate-100 rounded" />
                </div>
                <div className="flex items-center justify-between py-0.5">
                    <div className="h-4 w-24 bg-slate-200 rounded" />
                    <div className="h-4 w-28 bg-slate-100 rounded" />
                </div>
            </div>
        </section>
    );
};
