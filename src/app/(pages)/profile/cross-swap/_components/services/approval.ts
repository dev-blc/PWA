import { useQuery } from '@tanstack/react-query'
import { erc20Abi, formatUnits, parseUnits } from 'viem'
import { useReadContract, useWatchContractEvent } from 'wagmi'
import type { ApprovalStatusRequest, ApprovalStatusResponse } from '../../types'
import { CONFIG } from '../config'
import { APIError } from '../utils/errors'

/**
 * Service for handling token approval status checks
 */

interface UseApprovalStatusProps {
    tokenContractAddress: string
    userAddress: string
    totalAmount: string
    decimals: number
}

export const useApprovalStatus = ({
    tokenContractAddress,
    userAddress,
    totalAmount,
    decimals,
}: UseApprovalStatusProps) => {
    // Read the allowance from the contract
    const { data: allowance, error: contractError } = useReadContract({
        address: tokenContractAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [userAddress as `0x${string}`, CONFIG.CHAIN.BASE.routerAddress],
    })

    // Listen to Approval events to update the state
    useWatchContractEvent({
        address: tokenContractAddress as `0x${string}`,
        abi: erc20Abi,
        eventName: 'Approval',
        args: {
            owner: userAddress as `0x${string}`,
            spender: CONFIG.CHAIN.BASE.routerAddress,
        },
        onLogs(logs) {
            console.log('New approval event:', logs)
        },
    })

    // Fallback to the API if necessary
    const { data: apiApprovalStatus, error: apiError } = useQuery({
        queryKey: ['approvalStatus', tokenContractAddress, userAddress, totalAmount, decimals],
        queryFn: async (): Promise<boolean> => {
            const { path } = CONFIG.API.ENDPOINTS['approval/status']
            const params: ApprovalStatusRequest = {
                userWalletAddress: userAddress,
                tokenContractAddress,
                chainId: Number(CONFIG.CHAIN.BASE.chainId),
                defiPlatformIds: CONFIG.CHAIN.BASE.platformId,
            }

            const response = await fetch(
                `${CONFIG.API.BASE_URL}${path}?${new URLSearchParams(params as unknown as URLSearchParams)}`,
                { headers: CONFIG.API.HEADERS as HeadersInit },
            )

            if (!response.ok) {
                throw new APIError('UNKNOWN', 'Failed to fetch approval status')
            }

            const data = (await response.json()) as ApprovalStatusResponse
            const approvedAmount = data[CONFIG.CHAIN.BASE.platformId]?.amount

            if (!approvedAmount) {
                throw new APIError('UNKNOWN', 'No approval amount found for platform')
            }

            return BigInt(approvedAmount) >= parseUnits(totalAmount, decimals)
        },
        enabled: !allowance, // Solo ejecutar si no tenemos allowance del contrato
        staleTime: 30 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 2,
    })

    const isApproved = allowance ? allowance >= parseUnits(totalAmount, decimals) : (apiApprovalStatus ?? false)

    const approvedAmount = allowance ? formatUnits(allowance, decimals) : '0'

    return {
        isApproved,
        approvedAmount,
        error: contractError || apiError,
        isLoading: !allowance && !apiApprovalStatus,
        allowance,
        apiApprovalStatus,
    }
}

// Tipo de ayuda para los consumidores del hook
export type ApprovalStatusReturn = ReturnType<typeof useApprovalStatus>
