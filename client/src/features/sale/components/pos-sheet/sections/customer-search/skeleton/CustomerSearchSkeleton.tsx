import { Skeleton } from "@/components/ui/skeleton";

export function CustomerSearchSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
        </div>
    );
}
