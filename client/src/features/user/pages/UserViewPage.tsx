import { useParams } from 'react-router-dom'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../operations/op.queries'
import { EmptyState } from '@/components/ui/empty-state'
import { UserX } from 'lucide-react'
import {
    UserViewLayout,
    UserProfileHeader,
    UserAboutCard,
    UserActivityCard
} from '../components/user-view'

export function UserViewPage() {
    const { userId } = useParams()

    const { loading, error, data } = useQuery(GET_USER, {
        variables: { userId },
        fetchPolicy: 'cache-and-network',
    })

    if (error) {
        let errCode = error.graphQLErrors?.[0]?.extensions?.code;
        let displayMessage = error.message;

        if (!errCode) {
            try {
                const parsedError = JSON.parse(error.message);
                errCode = parsedError[0]?.code;
                if (parsedError[0]?.message) {
                    displayMessage = parsedError[0].message;
                }
            } catch (e) {
                // Ignore JSON parse error if message is a plain string
            }
        }

        const isNotFound =
            errCode === 'invalid_format' ||
            errCode === 'NOT_FOUND' ||
            error.message.includes('Invalid `prisma') ||
            error.message.toLowerCase().includes('not found');

        if (isNotFound) {
            return (
                <EmptyState
                    icon={UserX}
                    title="User Not Found"
                    description="The user you are looking for does not exist or has an invalid ID."
                    showBackButton
                />
            )
        }

        return (
            <EmptyState
                title="Something went wrong"
                description={displayMessage}
                showBackButton
            />
        )
    }

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
                    <UserActivityCard isLoading={loading} />
                </div>
            </div>
        </UserViewLayout>
    )
}
