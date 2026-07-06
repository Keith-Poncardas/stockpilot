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
