import { Skeleton } from "@/components/ui/skeleton";

export function PaymentActionsSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <Skeleton className="h-6 w-48 mb-2" />
            <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-8 w-32" />
            </div>
            <Skeleton className="h-12 w-full rounded-lg" />
        </div>
    );
}
