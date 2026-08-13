import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../operations/op.queries'

import {
    UserViewLayout,
    UserProfileHeader,
    UserAboutCard,
    UserActivityCard
} from '../components/user-view'

/**
 * Renders the user profile view page.
 *
 * Fetches and displays detailed information about a specific user,
 * including their profile header, about section, and activity logs.
 * Automatically redirects to the previous page if an error occurs.
 */
export function UserViewPage() {
    const { userId } = useParams<{ userId: string }>()
    const navigate = useNavigate();

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { userId },
        fetchPolicy: 'cache-and-network',
        skip: !userId,
    })

    // Handle error navigation within useEffect to prevent side-effects during render
    useEffect(() => {
        if (error) {
            navigate(-1);
        }
    }, [error, navigate]);

    const user = data?.getUser

    return (
        <UserViewLayout
            isLoading={loading}
            header={<UserProfileHeader user={user} isLoading={loading} />}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-4">
                    <UserAboutCard user={user} isLoading={loading} />
                </div>
                <div className="md:col-span-2 space-y-4">
                    <UserActivityCard />
                </div>
            </div>
        </UserViewLayout>
    )
}
