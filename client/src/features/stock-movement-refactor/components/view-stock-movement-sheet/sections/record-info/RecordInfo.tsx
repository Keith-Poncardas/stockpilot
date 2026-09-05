import { formatDateTime } from "@/lib/utils";
import { RecordInfoLayout } from "./RecordInfoLayout";
import { RecordInfoSkeleton } from "./RecordInfoSkeleton";
import type { RecordInfoProps } from "./types";

export function RecordInfo({ movement }: RecordInfoProps) {
    let formattedDate: string;

    try {
        formattedDate = formatDateTime(movement.createdAt, undefined, "long");
    } catch {
        formattedDate = "—";
    }

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
