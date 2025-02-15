import PageWrapper from '@/components/page-wrapper'
import CrossChainSwapSection from './_components/cross-chain-swap-section'

export default function ProfileLayout() {
    return (
        <PageWrapper
            topBarProps={{
                backButton: true,
                title: 'swap',
            }}>
            <div className='flex flex-1 flex-col gap-3'>
                <CrossChainSwapSection />
            </div>
        </PageWrapper>
    )
}
