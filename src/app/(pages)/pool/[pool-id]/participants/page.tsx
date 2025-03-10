import PageWrapper from '@/components/page-wrapper'
import { getUserAdminStatusActionWithCookie } from '@/features/users/actions'
import Participants from './_components/participants'

type Props = { params: Promise<{ 'pool-id': string }> }

export default async function ManageParticipantsPage({ params }: Props) {
    const { 'pool-id': poolId } = await params
    const isAdmin = await getUserAdminStatusActionWithCookie()

    return (
        <PageWrapper topBarProps={{ title: isAdmin ? 'Manage Participants' : 'Participants', backButton: true }}>
            <Participants poolId={poolId} isAdmin={isAdmin} />
        </PageWrapper>
    )
}
