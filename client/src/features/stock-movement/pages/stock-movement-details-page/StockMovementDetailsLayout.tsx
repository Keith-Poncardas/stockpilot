import type { StockMovementDetailsLayoutProps } from "./types";

/**
 * A responsive layout component for the Stock Movement Details page.
 * Displays content in a two-column grid on large screens and a single column on smaller screens.
 *
 * @param {StockMovementDetailsLayoutProps} props - The component props containing left and right content elements.
 * @returns {JSX.Element} The rendered layout structure.
 */
export function StockMovementDetailsLayout({
    leftContent,
    rightContent
}: StockMovementDetailsLayoutProps) {
    return (
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-6 max-sm:mb-15">

            <div className="lg:col-span-2 flex flex-col gap-6">
                {leftContent}
            </div>

            <div className="flex flex-col gap-6">
                {rightContent}
            </div>

        </main>
    )
};