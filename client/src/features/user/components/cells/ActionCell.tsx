import { Link } from 'react-router-dom'
import type { UserRowInfoCellProps } from '../../user.types'

export function ActionCell({ row }: UserRowInfoCellProps) {
    const { id } = row.original;

    return (
        <div className='flex gap-1'>

            <Link to={`/users/${id}/view`} className='underline font-bold text-xs'>
                View User
            </Link>

        </div>
    )
}