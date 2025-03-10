'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/app/_components/ui/avatar'
import { formatAddress } from '@/app/_lib/utils/addresses'
import { currentTokenAddress } from '@/app/_server/blockchain/server-config'
import { useParticipants } from '@/hooks/use-participants'
import frog from '@/public/app/images/frog.png'
import { useParams } from 'next/navigation'
import type { Address } from 'viem'
import { usePoolDetails } from '../../../ticket/_components/use-pool-details'
import { useUserDetails } from '../../_components/use-user-details'
import PayoutForm from './payout-form'

type Params = {
    'pool-id': string
    'participant-id': Address
}

function ClientParticipantPayout() {
    const params = useParams<Params>()
    const { data: userDetails } = useUserDetails(params['participant-id'])
    const { poolDetails } = usePoolDetails(params?.['pool-id'])
    const { data: participants } = useParticipants(params?.['pool-id'])

    const tokenAddress = poolDetails?.poolDetailFromSC?.[4] ?? currentTokenAddress
    const avatar = userDetails?.avatar ?? frog.src
    const displayName = userDetails?.displayName ?? formatAddress(params['participant-id'])

    const currentParticipant = participants?.find(participant => participant.address === params['participant-id'])
    const isCheckedIn = currentParticipant?.checkedInAt != null

    return (
        <div className='max-w-md self-center overflow-hidden rounded-lg bg-white'>
            <div className='mt-6 flex flex-col items-center'>
                <Avatar className='size-[73px]' aria-label='User Avatar'>
                    <AvatarImage alt='User Avatar' src={avatar} />
                    <AvatarFallback className='bg-[#d9d9d9]' />
                </Avatar>
                <div className='flex flex-row'>
                    <h3 className='flex h-10 flex-1 flex-row items-center justify-center font-semibold'>
                        {displayName}
                    </h3>
                </div>
                <div className='flex flex-row justify-center'>
                    {isCheckedIn ? (
                        <p className='font-medium text-[#6993FF]'>Checked in</p>
                    ) : (
                        <p className='text-[#B2B2B2]'>Registered</p>
                    )}
                </div>
                <PayoutForm
                    poolId={params['pool-id']}
                    participantId={params['participant-id']}
                    tokenAddress={tokenAddress}
                />
            </div>
        </div>
    )
}

export default ClientParticipantPayout
