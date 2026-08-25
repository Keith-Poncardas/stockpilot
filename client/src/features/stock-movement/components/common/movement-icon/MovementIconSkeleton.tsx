/**
 * Skeleton loader for the MovementIcon component.
 * It renders an animated circle of the same dimensions as the actual icon.
 * 
 * @returns A React element containing the pulsing skeleton.
 */
export function MovementIconSkeleton() {
    return (
        <span className="inline-flex w-8 h-8 rounded-full shrink-0 bg-slate-200 animate-pulse" />
    );
}