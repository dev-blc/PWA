import { Card } from '@/app/_components/ui/card'
import type { OKXNetwork, OKXToken, Transaction } from '../types'
import { TransactionHistoryButton } from './TransactionHistoryButton'

interface UserInfoCardProps {
    walletAddress?: string
    fetchedNetworks: OKXNetwork[]
    fetchedTokens: OKXToken[]
    transactions: Transaction[]
}

export const UserInfoCard = ({ walletAddress, fetchedNetworks, fetchedTokens, transactions }: UserInfoCardProps) => {
    return (
        <Card className='flex items-center justify-between p-4'>
            <div className='flex items-center gap-4'>
                <div>
                    <p className='text-sm text-gray-500'>Connected Wallet</p>
                    <p className='font-medium'>
                        {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : 'Not connected'}
                    </p>
                </div>
            </div>
            {walletAddress && (
                <TransactionHistoryButton
                    walletAddress={walletAddress}
                    fetchedNetworks={fetchedNetworks}
                    fetchedTokens={fetchedTokens}
                    transactions={transactions}
                />
            )}
        </Card>
    )
}
