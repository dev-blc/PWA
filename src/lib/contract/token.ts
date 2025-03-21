import { serverConfig } from '@/app/_server/blockchain/server-config'
import { tokenAbi } from '@/types/contracts'
import { getPublicClient } from '@wagmi/core'
import { Address, getAbiItem } from 'viem'

const publicClient = getPublicClient(serverConfig)

export function getTokenSymbol(tokenAddress: Address) {
    return publicClient?.readContract({
        address: tokenAddress,
        abi: [getAbiItem({ abi: tokenAbi, name: 'symbol' })],
        functionName: 'symbol',
    })
}

export function getTokenDecimals(tokenAddress: Address) {
    return publicClient?.readContract({
        address: tokenAddress,
        abi: [getAbiItem({ abi: tokenAbi, name: 'decimals' })],
        functionName: 'decimals',
    })
}
