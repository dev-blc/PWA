import PullToRefresh from '@/app/_components/pull-to-refresh'
import AuthModal from '@/components/auth-modal'
import MainPageLoginButton from '@/components/main-page-login-button'
import PageWrapper from '@/components/page-wrapper'
import TopSection from '@/components/top-section'
import { Suspense } from 'react'
import NextUserPool from './_components/next-user-pool'
import RenderBottomBar from './_components/render-bottom-bar'
import UpcomingPools from './_components/upcoming-pools'

export default function PoolsPage() {
    return (
        <PageWrapper>
            <Suspense fallback={null}>
                <AuthModal />
            </Suspense>
            <div className='flex h-full flex-1 flex-col'>
                <TopSection topBarProps={{ backButton: false }} />
                <div className='relative flex-1 overflow-hidden'>
                    <PullToRefresh keysToRefetch={['pools', 'next-user-pool', 'upcoming-pools']}>
                        <div
                            className='absolute inset-0 overflow-y-auto overscroll-y-contain [&::-webkit-scrollbar]:hidden'
                            style={{
                                msOverflowStyle: 'none', // Hide scrollbar in IE/Edge
                                scrollbarWidth: 'none', // Hide scrollbar in Firefox
                                WebkitOverflowScrolling: 'touch',
                            }}>
                            <div className='mt-4 space-y-4 px-1 pb-safe'>
                                <NextUserPool />
                                <UpcomingPools />
                            </div>
                        </div>
                    </PullToRefresh>
                </div>
            </div>
            <MainPageLoginButton />
            <RenderBottomBar />
        </PageWrapper>
    )
}
