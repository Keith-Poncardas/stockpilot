import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 animate-pulse" />
      <div className="mt-2.5 h-4 w-3/4 rounded-md bg-slate-100 animate-pulse" />
      <div className="mt-1 h-3 w-1/2 rounded-md bg-slate-100 animate-pulse" />
      <div className="mt-2.5 h-3.5 w-24 rounded-md bg-slate-100 animate-pulse" />
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5">
        <div className="h-4 w-16 rounded-md bg-slate-100 animate-pulse" />
        <div className="h-7 w-14 rounded-md bg-slate-100 animate-pulse" />
      </div>
    </div>
  );
}

export function ProductCatalogSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full rounded-md" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        </div>
    );
}
