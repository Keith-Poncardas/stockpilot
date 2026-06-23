import type { ElementType } from 'react'
import { getRoleColor, getStatusColor, getApprovalStatusColor } from '@/lib/utils'

type BadgeType = 'ROLE' | 'STATUS' | 'APPROVAL_STATUS'

interface BadgeProps {
    status: string
    type: BadgeType
    Icon?: ElementType
}

function Badge({ status, type, Icon }: BadgeProps) {
    const color = type === 'ROLE'
        ? getRoleColor(status)
        : type === 'APPROVAL_STATUS'
            ? getApprovalStatusColor(status)
            : getStatusColor(status);

    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-1 text-xs font-semibold tracking-wide rounded-sm ${color}`}
        >
            {Icon && <Icon size={16} strokeWidth={2.1} />}
            <span>{status.replace(/_/g, ' ')}</span>
        </span>
    )
};

export default Badge