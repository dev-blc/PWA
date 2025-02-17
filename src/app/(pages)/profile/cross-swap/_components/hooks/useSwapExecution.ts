import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { parseUnits, type Hash } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import type { Network, Token } from '../../types'
import { CONFIG } from '../config'

interface SwapExecutionParams {
    fromNetwork: Network
    fromToken: Token
    fromAmount: string
    onSwapComplete: () => void
}

export const useSwapExecution = ({ fromNetwork, fromToken, fromAmount, onSwapComplete }: SwapExecutionParams) => {
    const { address } = useAccount()
    const { data: walletClient } = useWalletClient()
    const publicClient = usePublicClient()

    const approveMutation = useMutation({
        mutationFn: async () => {
            if (!walletClient || !address) {
                throw new Error('Please connect your wallet')
            }

            // Add network validation
            const currentChainId = await walletClient.getChainId()
            if (currentChainId.toString() !== fromNetwork.chainId) {
                await walletClient.switchChain({ id: Number(fromNetwork.chainId) })
            }

            // Preparar la transacción de aprobación usando viem
            const approveAmount = parseUnits(fromAmount, Number(fromToken.decimals)) * 4n

            // Enviar la transacción de aprobación
            const hash = await walletClient.writeContract({
                address: fromToken.tokenContractAddress as `0x${string}`,
                abi: [
                    {
                        name: 'approve',
                        type: 'function',
                        stateMutability: 'nonpayable',
                        inputs: [
                            { name: 'spender', type: 'address' },
                            { name: 'amount', type: 'uint256' },
                        ],
                        outputs: [{ name: '', type: 'bool' }],
                    },
                ],
                functionName: 'approve',
                args: [CONFIG.CHAIN.BASE.routerAddress as `0x${string}`, approveAmount],
            })

            // Esperar la confirmación
            const receipt = await publicClient?.waitForTransactionReceipt({ hash })
            if (receipt?.status !== 'success') {
                throw new Error('Approval transaction failed')
            }

            return hash
        },
        onSuccess: (hash: Hash) => {
            toast.success('Token approved successfully with hash: ' + hash)
        },
        onError: (error: Error) => {
            console.error('Approval error:', error)
            toast.error(error.message || 'Error approving token')
        },
    })

    const swapMutation = useMutation({
        mutationFn: async () => {
            if (!walletClient || !address) {
                throw new Error('Wallet not connected')
            }

            // Ensure we are on the correct network
            await walletClient.switchChain({
                id: Number(fromNetwork.chainId),
            })

            // Prepare the swap parameters
            const amount = parseUnits(fromAmount, Number(fromToken.decimals))

            // Send the swap transaction
            const hash = await walletClient.writeContract({
                address: CONFIG.CHAIN.BASE.routerAddress as `0x${string}`,
                abi: [
                    {
                        name: 'swap',
                        type: 'function',
                        stateMutability: 'payable',
                        inputs: [
                            { name: 'tokenIn', type: 'address' },
                            { name: 'tokenOut', type: 'address' },
                            { name: 'amountIn', type: 'uint256' },
                            { name: 'minAmountOut', type: 'uint256' },
                            { name: 'to', type: 'address' },
                        ],
                        outputs: [{ name: 'amountOut', type: 'uint256' }],
                    },
                ],
                functionName: 'swap',
                args: [
                    fromToken.tokenContractAddress as `0x${string}`,
                    CONFIG.CHAIN.BASE.tokens.USDC.tokenContractAddress as `0x${string}`,
                    amount,
                    // Calcular minAmountOut basado en slippage (1.5%)
                    (amount * 985n) / 1000n,
                    address,
                ],
                value:
                    fromToken.tokenContractAddress === CONFIG.CHAIN.BASE.tokens.USDC.tokenContractAddress ? amount : 0n,
            })

            // Esperar la confirmación
            const receipt = await publicClient?.waitForTransactionReceipt({ hash })
            if (receipt?.status !== 'success') {
                throw new Error('Swap transaction failed')
            }

            return hash
        },
        onSuccess: (hash: Hash) => {
            toast.success('Swap executed successfully with hash: ' + hash)
            onSwapComplete()
        },
        onError: (error: Error) => {
            console.error('Swap error:', error)
            toast.error(error.message || 'Error executing swap')
        },
    })

    return {
        approve: () => approveMutation.mutate(),
        swap: () => swapMutation.mutate(),
        isApproving: approveMutation.isPending,
        isSwapping: swapMutation.isPending,
        approveError: approveMutation.error,
        swapError: swapMutation.error,
    }
}
