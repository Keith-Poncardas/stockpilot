/**
 * VirtualInfiniteList
 *
 * A self-contained, cursor-paginated, virtualised list dropdown.
 *
 * - Uses @tanstack/react-virtual so only visible rows (+overscan) are in the DOM.
 * - Calls `onLoadMore` automatically when the user scrolls within 80 px of the bottom.
 * - Renders animated skeleton rows during initial load and while fetching more pages.
 * - Fully generic (TItem) and accepts a `renderItem` render-prop for the row content.
 */

import { useRef, useCallback, type ReactNode } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

// ─── Skeleton rows ────────────────────────────────────────────────────────────

/**
 * Generic two-line pulsing skeleton.
 * Widths are staggered by index so rows don't all look identical.
 */
function DefaultSkeletonRow({ index }: { index: number }) {
    // Alternate between three width pairs to add visual variety
    const widths = [
        { title: "55%", sub: "30%" },
        { title: "68%", sub: "38%" },
        { title: "42%", sub: "24%" },
    ];
    const { title, sub } = widths[index % widths.length];

    return (
        <li
            className="flex items-center justify-between gap-3 px-3.5 py-2.5 animate-pulse"
            aria-hidden="true"
        >
            <div className="flex flex-col gap-2 min-w-0 flex-1">
                <div className="h-3.5 rounded-md bg-ink/[0.08]" style={{ width: title }} />
                <div className="h-2.5 rounded-md bg-ink/[0.06]" style={{ width: sub }} />
            </div>
            <div className="h-3 w-12 rounded-md bg-ink/[0.06] shrink-0" />
        </li>
    );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface VirtualInfiniteListProps<TItem> {
    // ── Data & pagination state (matches UseInfiniteScrollResult) ──────────
    items: TItem[];
    /** True while the first page is in-flight (or after a search reset). */
    loading: boolean;
    /** True while a subsequent page is being appended. */
    isFetchingMore: boolean;
    hasNextPage: boolean;
    onLoadMore: () => void;

    // ── Row rendering ───────────────────────────────────────────────────────
    /**
     * Renders each row's content. May return a `<li>` or any element —
     * it is placed inside the virtualizer's absolutely-positioned row `<div>`.
     */
    renderItem: (item: TItem, index: number) => ReactNode;

    /**
     * Custom skeleton row renderer. Receives the 0-based row index so widths
     * can be staggered. Falls back to the built-in two-line pulse row.
     */
    renderSkeleton?: (index: number) => ReactNode;

    // ── Layout & copy ───────────────────────────────────────────────────────
    /** Estimated row height in px fed to the virtualizer. Default: 52. */
    estimateSize?: number;
    /** CSS max-height of the scrollable `<ul>`. Default: "18rem". */
    maxHeight?: string;
    /** Text shown when `loading` is false and `items` is empty. */
    emptyMessage?: string;
    /** Number of skeleton rows shown during initial load. Default: 4. */
    skeletonCount?: number;
    /** Extra classes on the outer `<ul>` element. */
    className?: string;
    "aria-label"?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function VirtualInfiniteList<TItem>({
    items,
    loading,
    isFetchingMore,
    hasNextPage,
    onLoadMore,
    renderItem,
    renderSkeleton,
    estimateSize = 52,
    maxHeight = "18rem",
    emptyMessage = "No results found.",
    skeletonCount = 4,
    className = "",
    "aria-label": ariaLabel,
}: VirtualInfiniteListProps<TItem>) {
    const scrollContainerRef = useRef<HTMLUListElement>(null);

    // ── Virtualizer ──────────────────────────────────────────────────────────
    const rowVirtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => estimateSize,
        overscan: 4,
    });

    // ── Scroll-based load-more trigger ───────────────────────────────────────
    const handleScroll = useCallback(() => {
        const el = scrollContainerRef.current;
        if (!el || !hasNextPage || isFetchingMore) return;
        if (el.scrollTop + el.clientHeight >= el.scrollHeight - 80) {
            onLoadMore();
        }
    }, [hasNextPage, isFetchingMore, onLoadMore]);

    // ── Skeleton renderer ────────────────────────────────────────────────────
    const skeletonRow = (i: number) =>
        renderSkeleton ? renderSkeleton(i) : <DefaultSkeletonRow index={i} />;

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <ul
            ref={scrollContainerRef}
            onScroll={handleScroll}
            role="listbox"
            aria-label={ariaLabel}
            aria-busy={loading || isFetchingMore}
            className={[
                "absolute z-30 mt-1.5 w-full overflow-y-auto",
                "rounded-lg border border-hairline bg-white py-1",
                "shadow-lg shadow-ink/10",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
            style={{ maxHeight }}
        >
            {/* ── Initial loading skeletons ────────────────────────────────── */}
            {loading &&
                Array.from({ length: skeletonCount }, (_, i) => (
                    <div key={i}>{skeletonRow(i)}</div>
                ))}

            {/* ── Empty state ───────────────────────────────────────────────── */}
            {!loading && items.length === 0 && (
                <li className="px-3.5 py-3 text-sm text-ink/40">{emptyMessage}</li>
            )}

            {/* ── Virtualised rows ──────────────────────────────────────────────
                One inner div sized to the TOTAL virtual height acts as the scroll
                track. Only visible rows (+overscan) are absolutely positioned
                inside it, keeping the DOM count at ~5–10 no matter how many items
                are in `items`.
            ──────────────────────────────────────────────────────────────────── */}
            {!loading && items.length > 0 && (
                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        position: "relative",
                        width: "100%",
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                        <div
                            key={virtualRow.key}
                            data-index={virtualRow.index}
                            ref={rowVirtualizer.measureElement}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {renderItem(items[virtualRow.index], virtualRow.index)}
                        </div>
                    ))}
                </div>
            )}

            {/* ── Fetch-more skeleton ───────────────────────────────────────── */}
            {isFetchingMore &&
                Array.from({ length: 2 }, (_, i) => (
                    <div key={`more-${i}`}>{skeletonRow(i)}</div>
                ))}

            {/* ── End-of-list indicator ────────────────────────────────────── */}
            {!hasNextPage && items.length > 0 && !loading && !isFetchingMore && (
                <li className="px-3.5 py-2 text-[11px] text-ink/30 text-center select-none">
                    All results loaded
                </li>
            )}
        </ul>
    );
}
