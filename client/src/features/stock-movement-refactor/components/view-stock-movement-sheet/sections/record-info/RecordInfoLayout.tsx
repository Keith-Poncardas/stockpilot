import { FormSection } from "@/components/ui/form-section";
import { Calendar } from "lucide-react";
import type { RecordInfoLayoutProps } from "./types";

export function RecordInfoLayout({ children }: RecordInfoLayoutProps) {
    return (
        <FormSection
            title="Movement Record"
            description="Information about this stock movement record."
            icon={<Calendar className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            {children}
            <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <svg
                    className="h-4 w-4 text-slate-400 shrink-0 mt-0.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
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
