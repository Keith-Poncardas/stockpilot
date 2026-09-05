import { FormSection } from '@/components/ui/form-section';
import { Box } from 'lucide-react';
import type { MovementSummaryLayoutProps } from './types';

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
}
