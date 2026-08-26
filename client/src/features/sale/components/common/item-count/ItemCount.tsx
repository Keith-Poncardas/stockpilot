import { NumberBadge } from "@/components";

interface ItemCountProps {
    count: number;
}

/**
 * Renders the total number of items using the global NumberBadge component.
 */
export function ItemCount({ count }: ItemCountProps) {
    return <NumberBadge count={count} />;
}
