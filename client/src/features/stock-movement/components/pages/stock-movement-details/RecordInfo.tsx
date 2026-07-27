import { FormSection } from "@/components/ui/form-section";
import type { IStockMovement } from "@/features/stock-movement/stock-movement.types";
import { Calendar } from "lucide-react";

interface RecordInfoProps {
    movement: IStockMovement;
}

function formatRecordDate(dateString: string): string {
    const isNumeric = /^\d+$/.test(dateString);
    const parsedDate = new Date(isNumeric ? Number(dateString) : dateString);
    if (isNaN(parsedDate.getTime())) return "—";

    return parsedDate.toLocaleString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export function RecordInfo({ movement }: RecordInfoProps) {
    const formattedDate = formatRecordDate(movement.createdAt);

    return (
        <FormSection
            title="Movement Record"
            description="Information about this stock movement record."
            icon={<Calendar className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
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
                <div>
                    <dt className="text-xs text-slate-400 mb-1">Movement ID</dt>
                    <dd className="text-xs font-mono text-slate-600 break-all">
                        {movement.id}
                    </dd>
                </div>
            </dl>
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <svg
                    className="h-4 w-4 text-slate-400 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x={5} y={11} width={14} height={9} rx={2} />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Stock movements are immutable once recorded. To correct an error, void
                    this entry and record a new adjustment.
                </p>
            </div>
        </FormSection>
    );
}


function RecordInfoSkeleton() {
    return (
        <FormSection
            title="Movement Record"
            description="Information about this stock movement record."
            icon={<Calendar className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
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
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <svg
                    className="h-4 w-4 text-slate-400 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <rect x={5} y={11} width={14} height={9} rx={2} />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                </svg>
                <p className="text-xs text-slate-400 leading-relaxed">
                    Stock movements are immutable once recorded. To correct an error, void
                    this entry and record a new adjustment.
                </p>
            </div>
        </FormSection>
    );
}

RecordInfo.skeleton = RecordInfoSkeleton;
