import { Activity, MoreHorizontal } from 'lucide-react'
import { FormSection } from '@/components/ui/form-section'
import { EmptyState } from '@/components'

export function UserActivityCard() {
    return (
        <FormSection
            title="Recent Activity"
            description="User's recent actions and logs in the system"
            icon={<Activity className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-indigo-50 text-indigo-600"
        >
            <EmptyState
                icon={MoreHorizontal}
                title="Under Development"
                description="Not available at the moment"
            />
        </FormSection>
    )
}
