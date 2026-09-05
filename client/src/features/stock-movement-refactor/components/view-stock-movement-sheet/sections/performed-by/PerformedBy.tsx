import { FormSection } from "@/components/ui/form-section";
import { UserIdentityRow } from "@/components/UserIdentityRow";
import { User } from "lucide-react";
import { PerformedBySkeleton } from "./PerformedBySkeleton";
import type { PerformedByProps } from "./types";

const STOCKED_BY_ICON = <User className="h-4 w-4" strokeWidth={2} />;

export function PerformedBy({ movement }: PerformedByProps) {
    const { author, createdAt } = movement;
    const fullName = `${author.firstName} ${author.lastName}`;

    return (
        <FormSection
            title="Stocked By"
            icon={STOCKED_BY_ICON}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <UserIdentityRow
                name={fullName}
                fallback={author}
                role={author.role}
                performedAt={createdAt}
            />
        </FormSection>
    );
}

PerformedBy.Skeleton = PerformedBySkeleton;
