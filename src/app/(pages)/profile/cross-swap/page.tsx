import PageWrapper from '@/components/page-wrapper'
import AmountSection from './_components/amount-section'
import ProfileBalanceSection from './_components/balance-section'

export default function ProfileLayout() {
    return (
        <PageWrapper
            topBarProps={{
                backButton: true,
                title: 'swap',
            }}>
            <div className='flex flex-1 flex-col gap-3'>
                Sample rtext here
                <ProfileBalanceSection />
                <AmountSection />
            </div>
        </PageWrapper>
    )
}
