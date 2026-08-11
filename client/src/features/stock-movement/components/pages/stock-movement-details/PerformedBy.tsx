import { FormSection } from "@/components/ui/form-section";
import { UserIdentityRow } from "@/components/UserIdentityRow";
import { User } from "lucide-react";
import type { IStockMovement } from "@/features/stock-movement/stock-movement.types";

interface PerformedByProps {
    movement: IStockMovement;
    isLoading: boolean;
}

export function PerformedBy({ movement, isLoading }: PerformedByProps) {
    const { author, createdAt } = movement;
    const fullName = `${author.firstName} ${author.lastName}`;

    const performedAt = new Date(Number(createdAt));

    if (isLoading) {
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

    return (
        <FormSection
            title="Stocked By"
            icon={<User className="h-4 w-4" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <UserIdentityRow
                name={fullName}
                fallback={{ firstName: author.firstName, lastName: author.lastName }}
                role={author.role}
                performedAt={performedAt}
            />
        </FormSection>
    );
}

PerformedBy.skeleton = function PerformedBySkeleton() {
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
