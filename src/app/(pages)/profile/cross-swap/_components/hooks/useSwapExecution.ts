import { useWallets } from '@privy-io/react-auth'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { parseUnits, type Hash } from 'viem'
import { useAccount, usePublicClient, useWalletClient } from 'wagmi'
import type { MMError, OKXApprovalData, OKXNetwork, OKXToken } from '../../types'
import { HttpClient } from '../api/http-client'
import { CONFIG } from '../config'
import { toHex } from '../utils/formatters'

interface SwapExecutionParams {
    fromNetwork: OKXNetwork
    fromToken: OKXToken
    fromAmount: string
    onSwapComplete: () => void
}

export const useSwapExecution = ({ fromNetwork, fromToken, fromAmount, onSwapComplete }: SwapExecutionParams) => {
    const { address } = useAccount()
    const { wallets } = useWallets()
    const { data: walletClient } = useWalletClient()
    const publicClient = usePublicClient()

    const approveMutation = useMutation({
        mutationFn: async () => {
            if (!walletClient || !address) {
                throw new Error('Please connect your wallet')
            }
            const httpClient = HttpClient.getInstance()
            const { path } = CONFIG.API.ENDPOINTS['approve']
            const approveAmount = parseUnits(fromAmount, Number(fromToken.decimals)) * 4n
            const params = {
                chainId: fromNetwork.chainId,
                tokenContractAddress: fromToken.tokenContractAddress,
                approveAmount: approveAmount.toString(),
            }
            // OKX API request to approve token
            const response = await httpClient.get<OKXApprovalData[]>(path, params)
            console.log('response', response)
            if (response.code !== '0') {
                toast.error(response.msg || 'Failed to approve token')
                toast.message('Please try again')
                throw new Error(response.msg || 'Failed to approve token')
            }
            const provider = await wallets[0].getEthereumProvider()
            // Add network validation
            const currentChainId = await walletClient.getChainId()
            if (currentChainId.toString() !== fromNetwork.chainId) {
                await walletClient.switchChain({ id: Number(fromNetwork.chainId) }).catch(err => {
                    if ((err as MMError).code === 4902) {
                        toast.error('Please switch to the correct network')
                        toast.message('Please add the network to your wallet')
                        throw new Error('Please add the network to your wallet')
                    }
                })
            }
            // Send the approval transaction
            console.log('response', response.data[0])
            const approvalData = response.data[0]
            const txRequest = {
                gas: toHex(BigInt(approvalData.gasLimit)),
                gasPrice: toHex(BigInt(approvalData.gasPrice)),
                from: wallets[0].address,
                to: fromToken.tokenContractAddress,
                data: approvalData.data,
                value: '0x0',
            }
            const hash = await provider
                .request({
                    method: 'eth_sendTransaction',
                    params: [txRequest],
                })
                .then(res => {
                    console.log('res', res)
                    return res as `0x${string}`
                })
                .catch(err => {
                    console.log('err', err)
                    throw new Error('Approval transaction failed')
                })
            // Esperar la confirmación
            console.log('hash', hash)
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
