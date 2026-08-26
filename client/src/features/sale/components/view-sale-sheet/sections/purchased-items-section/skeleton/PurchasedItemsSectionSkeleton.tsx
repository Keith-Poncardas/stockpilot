import { FormSection } from "@/components/ui/form-section";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag } from "lucide-react";

export function PurchasedItemsSectionSkeleton() {
    return (
        <FormSection
            title="Purchased Items"
            description="Loading items..."
            icon={<ShoppingBag className="h-4.5 w-4.5" strokeWidth={2} />}
            flushContent
        >
            <div className="flex flex-col">
                <div className="flex flex-col border-b border-gray-200/80">
                    <div className="flex items-center px-6 py-3 border-b border-gray-200/80">
                        <Skeleton className="h-4 w-32" />
                    </div>
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
                            <div className="flex flex-col gap-2">
                                <Skeleton className="h-4 w-48" />
                                <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50/50">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-32" />
                </div>
            </div>
        </FormSection>
    );
}
