import { formatDateTime } from "@/lib/utils";
import { RecordInfoLayout } from "./RecordInfoLayout";
import { RecordInfoSkeleton } from "./RecordInfoSkeleton";
import type { RecordInfoProps } from "./types";

/**
 * Component that displays the metadata and record information of a stock movement.
 * Includes the creation date, reference number, and movement ID.
 *
 * @param {RecordInfoProps} props - The component properties.
 * @returns {JSX.Element} The rendered RecordInfo component.
 */
export function RecordInfo({ movement }: RecordInfoProps) {

    let formattedDate = "—";

    try {
        formattedDate = formatDateTime(movement.createdAt, undefined, "long");
    } catch { }

    return (
        <RecordInfoLayout>
            <dl className="space-y-3">
                <div>
                    <dt className="text-xs text-slate-400 mb-1">Created At</dt>
                    <dd className="text-sm font-medium text-slate-900">
                        {formattedDate}
                    </dd>
                </div>
                {movement.reference && (
                    <div>
                        <dt className="text-xs text-slate-400 mb-1">Reference Number</dt>
                        <dd className="text-sm font-medium text-slate-900">
                            {movement.reference}
                        </dd>
                    </div>
                )}
            </dl>
        </RecordInfoLayout>
    );
}

RecordInfo.Skeleton = RecordInfoSkeleton;
