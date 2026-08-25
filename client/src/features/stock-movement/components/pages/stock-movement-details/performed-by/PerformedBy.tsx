import { FormSection } from "@/components/ui/form-section";
import { UserIdentityRow } from "@/components/UserIdentityRow";
import { User } from "lucide-react";
import { PerformedBySkeleton } from "./PerformedBySkeleton";
import type { PerformedByProps } from "./types";

/**
 * Static icon element for the "Stocked By" section.
 * Extracted outside the component to prevent unnecessary re-renders.
 */
const STOCKED_BY_ICON = <User className="h-4 w-4" strokeWidth={2} />;

/**
 * Component that displays the user who performed the stock movement.
 * Includes the user's name, role, avatar, and the timestamp of the movement.
 *
 * @param {PerformedByProps} props - The properties for the component.
 * @returns {JSX.Element} The rendered "Stocked By" component.
 */
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
