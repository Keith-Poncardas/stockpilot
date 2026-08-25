import { FormSection } from '@/components/ui/form-section';
import { Box } from 'lucide-react';
import type { MovementSummaryLayoutProps } from './types';

/**
 * Layout component for displaying the movement summary.
 * Provides a consistent wrapper with title, description, and icon for the summary section.
 *
 * @param {MovementSummaryLayoutProps} props - The properties for the layout component.
 * @param {ReactNode} props.children - The content to be displayed within the layout.
 * @returns {JSX.Element} The rendered layout component.
 */
export function MovementSummaryLayout({ children }: MovementSummaryLayoutProps) {
    return (
        <FormSection
            title="Movement Summary"
            description="Overview of the stock movement"
            icon={<Box className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            {children}
        </FormSection>
    );
};
