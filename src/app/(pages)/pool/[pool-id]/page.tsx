import PageWrapper from '@/components/page-wrapper'
import PoolDetails from '@/features/pools/pages/pool-details'
import { getPoolDetailsById } from '@/features/pools/server/db/pools'
import { getUserAdminStatusActionWithCookie } from '@/features/users/actions'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'

type Props = {
    params: Promise<{ 'pool-id': string }>
}

export default async function PoolDetailsPage({ params }: Props) {
    const queryClient = new QueryClient()
    const { 'pool-id': poolId } = await params

    queryClient
        .prefetchQuery({
            queryKey: ['pool-details', poolId],
            queryFn: getPoolDetailsById,
        })
        .catch(error => {
            console.error('Error prefetch/ing pool details:', error)
        })

    queryClient
        .prefetchQuery({
            queryKey: ['userAdminStatus'],
            queryFn: getUserAdminStatusActionWithCookie,
        })
        .catch(error => {
            console.error('Error prefetching user admin status:', error)
        })

    return (
        <PageWrapper topBarProps={{ title: 'Pool Details', backButton: true }}>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <PoolDetails poolId={poolId} />
            </HydrationBoundary>
        </PageWrapper>
    )
}
