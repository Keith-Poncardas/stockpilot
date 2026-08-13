import Badge from '@/components/Badge'
import { formatDate } from '@/lib/utils'
import type { IUserProps } from '../../types'
import { FormSection } from '@/components/ui/form-section'
import { User } from 'lucide-react'
import { InfoRow } from '@/components/ui/info-row'

/**
 * Component that displays general information and metrics about a user.
 * Renders a card containing the user's role, status, join date, sales processed, and stock movements.
 * Shows skeleton loading rows while the user data is being fetched.
 * 
 * @param {IUserProps} props - The component props.
 * @param {IUserWithInfo | null} [props.user] - The user data to display.
 * @param {boolean} [props.isLoading] - Flag indicating if the user data is currently loading.
 * @returns {JSX.Element} The rendered UserAboutCard component.
 */
export function UserAboutCard({ user, isLoading }: IUserProps) {

    const details = [
        {
            label: 'Role',
            value: <Badge status={user?.role || ''} type='ROLE' />
        },
        {
            label: 'Status',
            value: <Badge status={user?.status || ''} type='STATUS' />
        },
        {
            label: 'Joined',
            value: <span className="font-medium text-gray-900">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
        },
        {
            label: 'Sales Processed',
            value: <span className="font-medium text-gray-900">{user?.salesCount ?? user?.stockMovementsCount ?? 0}</span>
        },
        {
            label: 'Stock Movements',
            value: <span className="font-medium text-gray-900">{user?.stockMovementsCount ?? user?.salesCount ?? 0}</span>
        },
    ];

    return (
        <FormSection
            title="About User"
            description="General user information and metrics"
            icon={<User className="w-4.5 h-4.5" strokeWidth={2} />}
            iconWrapperClassName="bg-blue-50 text-blue-600"
        >
            {!isLoading ? details.map((detail, index) => (
                <InfoRow
                    key={index}
                    label={detail.label}
                    value={
                        <span style={{ fontFamily: "'IBM Plex Sans', sans-serif" }}>
                            {detail.value}
                        </span>
                    }
                />
            )) : (
                <>
                    {details.map((_, i) => (
                        <InfoRow.Skeleton key={i} />
                    ))}
                </>
            )}
        </FormSection>
    )
}
