import { Skeleton } from "@/components/ui/skeleton";

export function CartSkeleton() {
    return (
        <div className="space-y-3">
            <Skeleton className="h-6 w-32 mb-2" />
            {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
        </div>
    );
}
