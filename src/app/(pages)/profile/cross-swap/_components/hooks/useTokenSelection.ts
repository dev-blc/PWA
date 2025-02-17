import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import type { Network, Token, TokensResponse } from '../../types'
import { HttpClient } from '../api/http-client'
import { CONFIG } from '../config'

interface TokenSelectionProps {
    fromNetwork: Network
}

export const useTokenSelection = ({ fromNetwork }: TokenSelectionProps) => {
    const [selectedNetwork, setSelectedNetwork] = useState<string>('all')
    const [searchQuery, setSearchQuery] = useState<string>('')

    const httpClient = HttpClient.getInstance()

    const {
        data: tokens,
        isLoading,
        error,
    } = useQuery<Token[], Error>({
        queryKey: ['tokens', fromNetwork.chainId],
        queryFn: async (): Promise<Token[]> => {
            const { path } = CONFIG.API.ENDPOINTS['tokens/all']
            const response = await httpClient.get<TokensResponse>(path, {
                chainId: fromNetwork.chainId,
            })

            if (response.code !== '0') {
                throw new Error(response.msg || 'Failed to fetch tokens')
            }

            if (!Array.isArray(response.data)) {
                throw new Error('Invalid response format')
            }

            return response.data
        },
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
    })

    const filteredTokens =
        tokens?.filter(token => {
            const matchesNetwork = selectedNetwork === 'all' || token.chainId === fromNetwork.chainId
            const searchLower = searchQuery.toLowerCase()
            const matchesSearch =
                token.tokenSymbol.toLowerCase().includes(searchLower) ||
                token.tokenName.toLowerCase().includes(searchLower)
            return matchesNetwork && matchesSearch
        }) ?? []

    return {
        tokens: tokens ?? [],
        filteredTokens,
        selectedNetwork,
        searchQuery,
        setSelectedNetwork,
        setSearchQuery,
        isLoading,
        error,
        hasTokens: Boolean(tokens?.length),
        hasFilteredTokens: filteredTokens.length > 0,
    }
}

export type TokenSelectionReturn = ReturnType<typeof useTokenSelection>
