import { User } from "lucide-react";
import { FormSection } from "@/components/ui/form-section";
import { UserAvatar } from "@/components/UserAvatar";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface PerformedBySectionProps {
    /** User's full name */
    name: string;
    /** Initials or user object for the avatar fallback */
    fallback?: string | { firstName?: string; lastName?: string } | null;
    /** Optional avatar image URL */
    avatarSrc?: string;
    /** Optional user role key used to tint the avatar (e.g. "inventory_manager") */
    avatarRole?: string;
    /** Optional live timestamp element id — content managed externally (e.g. JS) */
    timestampId?: string;
    /** Date/time when the adjustment was performed — defaults to now */
    performedAt?: Date;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function PerformedBySection({
    name,
    fallback,
    avatarSrc,
    avatarRole,
    timestampId = "performed-at-text",
    performedAt = new Date(),
}: PerformedBySectionProps) {
    const formattedDate = performedAt.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });

    return (
        <FormSection
            title="Stocked By"
            icon={<User className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            {/* User identity row */}
            <div className="mt-2 flex items-center gap-3">
                <UserAvatar
                    fallback={fallback ?? name}
                    src={avatarSrc}
                    role={avatarRole}
                    size="lg"
                />
                <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-900">{name}</p>
                    <p className="text-xs text-slate-500">{avatarRole.replace("_", " ")}</p>
                    <p className="mt-0.5 text-xs text-slate-400">{formattedDate}</p>
                    {timestampId && (
                        <p id={timestampId} className="sr-only" aria-live="polite" />
                    )}
                </div>
            </div>

            {/* Audit notice
            <Alert variant="info" className="mt-4 mb-0 text-xs">
                Adjustments are recorded under your account for audit purposes.
            </Alert> */}
        </FormSection>
    );
}

function PerformedBySectionSkeleton() {
    return (
        <FormSection
            title="Performed By"
            icon={<User className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <div className="mt-2 flex items-center gap-3">
                <div className="h-10 w-10 sm:h-12 sm:w-12 shrink-0 rounded-full bg-slate-100 animate-pulse" />
                <div className="min-w-0 flex-1">
                    <div className="h-4 w-32 rounded bg-slate-100 animate-pulse" />
                    <div className="mt-1.5 h-3 w-24 rounded bg-slate-100 animate-pulse" />
                    <div className="mt-1 h-3 w-28 rounded bg-slate-100 animate-pulse" />
                </div>
            </div>
        </FormSection>
    );
}

PerformedBySection.skeleton = PerformedBySectionSkeleton;
