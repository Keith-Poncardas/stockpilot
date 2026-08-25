import { FormSection } from "@/components/ui/form-section";
import { UserIdentityRow } from "@/components/UserIdentityRow";
import { User } from "lucide-react";

/**
 * Skeleton component for the PerformedBy section.
 * Displays a loading state with pulse animations matching the layout of the actual identity row.
 *
 * @returns {JSX.Element} The rendered skeleton component.
 */
export function PerformedBySkeleton() {
    return (
        <FormSection
            title="Stocked By"
            icon={<User className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <UserIdentityRow.Skeleton />
        </FormSection>
    );
}
