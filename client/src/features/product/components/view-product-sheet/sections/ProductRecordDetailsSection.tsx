import { FormSection } from '@/components/ui/form-section';
import { InfoRow } from '@/components/ui/info-row';
import { formatDate } from '@/lib/utils';
import { Clock } from 'lucide-react';

export interface ProductRecordDetailsSectionProps {
    status: string;
    createdAt: string;
    updatedAt: string;
    className?: string;
}

export function ProductRecordDetailsSection({
    status,
    createdAt,
    updatedAt,
    className,
}: ProductRecordDetailsSectionProps) {
    const formattedStatus = status.charAt(0) + status.slice(1).toLowerCase();

    return (
        <FormSection
            title="Record Details"
            description="System timestamps and lifecycle status"
            icon={<Clock className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-slate-100 text-slate-700"
            className={className}
        >
            <div className="flex flex-col">
                <InfoRow label="Status" value={formattedStatus} />
                <InfoRow label="Created" value={formatDate(createdAt)} />
                <InfoRow label="Last Updated" value={formatDate(updatedAt)} />
            </div>
        </FormSection>
    );
}

ProductRecordDetailsSection.Skeleton = function ProductRecordDetailsSectionSkeleton() {
    return (
        <FormSection
            title="Record Details"
            description="Loading record details..."
            icon={<Clock className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-slate-100 text-slate-700"
            className="animate-pulse"
        >
            <div className="flex flex-col">
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
                <InfoRow.Skeleton />
            </div>
        </FormSection>
    );
};
