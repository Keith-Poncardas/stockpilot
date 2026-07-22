import { formatDate } from "@/lib/utils";
import { ArrowDown, ArrowUp, RefreshCw, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export type StockMovementType = 'IN' | 'OUT' | 'ADJUSTMENT';

export interface StockMovementRecord {
    id: string;
    type: StockMovementType;
    description: string;
    reference: string | null;
    date: string;
    quantity: number;
}

interface StockMovementLedgerProps {
    data?: StockMovementRecord[];
    loading?: boolean;
    viewAllTo?: string;
}

export function StockMovementLedger({ data = [], loading = false, viewAllTo }: StockMovementLedgerProps) {
    if (loading) {
        return <StockMovementLedger.Skeleton />;
    }

    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-lg">
                    Stock Movement Ledger
                </h2>
                {viewAllTo && (
                    <Link
                        to={viewAllTo}
                        className="inline-flex items-center text-sm font-semibold text-amber-600 hover:text-amber-700 hover:underline"
                    >
                        View all
                        <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                )}
            </div>
            <div className="divide-y divide-dashed divide-[#E3E1DC]">
                {data.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[#9C9A91]">
                        No stock movements found.
                    </div>
                ) : (
                    data.map((record) => (
                        <div key={record.id} className="flex items-center justify-between gap-4 py-3">
                            <div className="flex items-center gap-3 min-w-0">
                                <MovementIcon type={record.type} />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {record.description || <span className="italic text-[#9C9A91]">No description</span>}
                                    </p>
                                    <p className="text-xs text-[#9C9A91] font-mono truncate">
                                        {record.reference
                                            ? <>{record.reference} · {formatDate(record.date)}</>
                                            : <><span className="italic">No reference</span> · {formatDate(record.date)}</>
                                        }
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`font-mono text-sm font-semibold shrink-0 ${record.type === 'IN' ? 'text-emerald-600' :
                                    record.type === 'OUT' ? 'text-rose-600' :
                                        'text-amber-600'
                                    }`}
                            >
                                {record.quantity > 0 ? `+${record.quantity}` : record.quantity}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
}

export function MovementIcon({ type }: { type: StockMovementType }) {
    switch (type) {
        case 'IN':
            return (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 shrink-0">
                    <ArrowDown className="w-4 h-4" />
                </span>
            );
        case 'OUT':
            return (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-rose-50 text-rose-600 shrink-0">
                    <ArrowUp className="w-4 h-4" />
                </span>
            );
        case 'ADJUSTMENT':
        default:
            return (
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-amber-50 text-amber-600 shrink-0">
                    <RefreshCw className="w-4 h-4" />
                </span>
            );
    }
}

StockMovementLedger.Skeleton = function StockMovementLedgerSkeleton() {
    return (
        <section className="bg-white rounded-2xl border border-[#E3E1DC] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
                <div className="h-6 w-48 bg-[#F0EFEA] animate-pulse rounded-md" />
                <div className="h-4 w-16 bg-[#F0EFEA] animate-pulse rounded-md" />
            </div>
            <div className="divide-y divide-dashed divide-[#E3E1DC]">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex items-center justify-between gap-4 py-3">
                        <div className="flex items-center gap-3 min-w-0 w-full">
                            <div className="w-8 h-8 bg-[#F0EFEA] animate-pulse rounded-full shrink-0" />
                            <div className="flex-1 space-y-2.5">
                                <div className="h-4 bg-[#F0EFEA] animate-pulse rounded-md w-3/4 max-w-50" />
                                <div className="h-3 bg-[#F0EFEA] animate-pulse rounded-md w-1/2 max-w-50" />
                            </div>
                        </div>
                        <div className="h-4 bg-[#F0EFEA] animate-pulse rounded-md w-6 shrink-0" />
                    </div>
                ))}
            </div>
        </section>
    );
}
