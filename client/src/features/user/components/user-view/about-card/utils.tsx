
import type { IUserWithInfo } from '../../../types';
import { StatusBadge } from '@/components/StatusBadge';
import { formatDate } from '@/lib/utils';

/**
 * Returns an array of formatted user details to be displayed in the UserAboutCard.
 * 
 * @param user - The user object containing the details.
 * @returns An array of objects with label and rendered JSX value.
 */
export const getUserDetails = (user?: IUserWithInfo | null) => [
    {
        label: 'Role',
        value: <StatusBadge value={user?.role || ''} />
    },
    {
        label: 'Status',
        value: <StatusBadge value={user?.status || ''} />
    },
    {
        label: 'Joined',
        value: <span className="font-medium text-gray-900">{user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
    },
    {
        label: 'Sales Processed',
        value: <span className="font-medium text-gray-900">{user?.salesCount ?? 0}</span>
    },
    {
        label: 'Stock Movements',
        value: <span className="font-medium text-gray-900">{user?.stockMovementsCount ?? 0}</span>
    },
];
