import { formatDate } from '@/lib/utils';

interface ProductRecordDetailsProps {
    status: string;
    createdAt: string;
    updatedAt: string;
}

export function ProductRecordDetails({
    status,
    createdAt,
    updatedAt,
}: ProductRecordDetailsProps) {
    const formattedStatus = status.charAt(0) + status.slice(1).toLowerCase();

    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Record Details</h2>
            <dl className="flex flex-col gap-3 text-sm">
                <div className="flex items-center justify-between">
                    <dt className="text-[#9C9A91]">Status</dt>
                    <dd className="font-medium">{formattedStatus}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-[#9C9A91]">Created</dt>
                    <dd className="font-medium">{formatDate(createdAt)}</dd>
                </div>
                <div className="flex items-center justify-between">
                    <dt className="text-[#9C9A91]">Last Updated</dt>
                    <dd className="font-medium">{formatDate(updatedAt)}</dd>
                </div>
            </dl>
        </section>
    );
}

ProductRecordDetails.Skeleton = function ProductRecordDetailsSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="h-6 w-32 bg-[#F0EFEA] animate-pulse rounded-md mb-4" />
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between py-0.5">
                    <div className="h-4 w-16 bg-[#F0EFEA] animate-pulse rounded-md" />
                    <div className="h-4 w-20 bg-[#F0EFEA] animate-pulse rounded-md" />
                </div>
                <div className="flex items-center justify-between py-0.5">
                    <div className="h-4 w-20 bg-[#F0EFEA] animate-pulse rounded-md" />
                    <div className="h-4 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />
                </div>
                <div className="flex items-center justify-between py-0.5">
                    <div className="h-4 w-24 bg-[#F0EFEA] animate-pulse rounded-md" />
                    <div className="h-4 w-28 bg-[#F0EFEA] animate-pulse rounded-md" />
                </div>
            </div>
        </section>
    );
}
