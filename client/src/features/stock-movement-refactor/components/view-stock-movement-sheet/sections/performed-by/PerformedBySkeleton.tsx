import { FormSection } from "@/components/ui/form-section";
import { UserIdentityRow } from "@/components/UserIdentityRow";
import { User } from "lucide-react";

const STOCKED_BY_ICON = <User className="h-4 w-4" strokeWidth={2} />;

export function PerformedBySkeleton() {
    return (
        <FormSection
            title="Stocked By"
            icon={STOCKED_BY_ICON}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <UserIdentityRow.Skeleton />
        </FormSection>
    );
}
