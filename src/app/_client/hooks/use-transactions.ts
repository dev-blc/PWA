import { useWallets } from '@privy-io/react-auth'
import { useEffect, useState, useCallback, useRef } from 'react'
import type { Hash, TransactionReceipt } from 'viem'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import { useCallsStatus, useWriteContracts } from 'wagmi/experimental'
import { ContractCall } from '@/app/_lib/entities/models/contract-call'

interface SmartTransactionResult {
    hash: Hash | null
    receipt: TransactionReceipt | null
    isLoading: boolean
    isError: boolean
    error: Error | null
}

interface TransactionConfig {
    type: 'JOIN_POOL' | 'ENABLE_DEPOSITS' | 'START_POOL' | 'END_POOL' | 'CLAIM_WINNING' | 'SET_WINNER' | 'SET_WINNERS'
    onSuccess?: () => void
}

export default function useTransactions() {
    const transactionInProgressRef = useRef(false)
    const [isInitialized, setIsInitialized] = useState(false)

    useEffect(() => {
        if (!isInitialized) {
            console.log('🔄 [useTransactions] Initializing hook')
            setIsInitialized(true)
        }
    }, [isInitialized])

    const {
        data: id,
        writeContractsAsync,
        isPending: isPaymasterPending,
    } = useWriteContracts({
        mutation: {
            onMutate(variables) {
                console.log('Optimistic update here', variables)
            },
            // onSuccess(data, variables, context) {},
        },
    })
    const { data: hash, writeContractAsync } = useWriteContract()
    const { wallets, ready: walletsReady } = useWallets()

    const [result, setResult] = useState<SmartTransactionResult>({
        hash: null,
        receipt: null,
        isLoading: false,
        isError: false,
        error: null,
    })

    const { data: callsStatus } = useCallsStatus({
        id: id as string,
        query: {
            enabled: Boolean(id),
            refetchInterval: data => (data.state.data?.status === 'CONFIRMED' ? false : 1000),
        },
    })

    const {
        data: receipt,
        isLoading: isConfirming,
        isSuccess: isEoaConfirmed,
    } = useWaitForTransactionReceipt({
        hash: result.hash as Hash | undefined,
    })

    const [isConfirmed, setIsConfirmed] = useState(false)

    useEffect(() => {
        if (callsStatus?.status === 'CONFIRMED' && callsStatus.receipts && callsStatus.receipts.length > 0) {
            const paymasterReceipt = callsStatus.receipts[0]
            console.log('✅ [useTransactions] Paymaster transaction confirmed:', {
                hash: paymasterReceipt.transactionHash,
                blockNumber: paymasterReceipt.blockNumber,
                gasUsed: paymasterReceipt.gasUsed.toString(),
            })
            setResult(prev => ({ ...prev, hash: paymasterReceipt.transactionHash }))
            setIsConfirmed(true)
        }
    }, [callsStatus])

    useEffect(() => {
        if (isEoaConfirmed) {
            console.log('Transaction confirmed by EOA')
            setIsConfirmed(true)
        }
    }, [isEoaConfirmed])

    const resetConfirmation = useCallback(() => {
        setIsConfirmed(false)
    }, [])

    useEffect(() => {
        if (hash) {
            console.log('Hash updated from writeContract:', hash)
            setResult(prev => ({ ...prev, hash }))
        }
    }, [hash])

    const executeCoinbaseTransactions = useCallback(
        async (contractCalls: ContractCall[]) => {
            console.log('🔄 [useTransactions] Executing Coinbase transaction with calls:', contractCalls)

            try {
                console.log('🔍 [useTransactions] Checking wallet state:', {
                    walletsReady,
                    hasWallet: Boolean(wallets[0]),
                    walletAddress: wallets[0]?.address,
                })

                setResult(prev => ({ ...prev, isLoading: true, isError: false, error: null }))

                if (!walletsReady || !wallets[0]) {
                    console.error('❌ [useTransactions] Wallet not connected')
                    throw new Error('Wallet not connected')
                }

                console.log('📝 [useTransactions] Submitting transaction to Coinbase with payload:', {
                    contracts: contractCalls,
                    paymasterUrl: process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL,
                })

                const response = await writeContractsAsync({
                    contracts: contractCalls,
                    capabilities: {
                        paymasterService: {
                            url: process.env.NEXT_PUBLIC_COINBASE_PAYMASTER_URL,
                        },
                    },
                })
                console.log('✅ [useTransactions] Coinbase transaction response:', response)
                setResult(prev => ({ ...prev, hash: response as `0x${string}` }))
            } catch (error) {
                console.error('❌ [useTransactions] Coinbase transaction error:', error)
                setResult(prev => ({
                    ...prev,
                    isError: true,
                    error: error as Error,
                }))
                throw error
            } finally {
                console.log('🔄 [useTransactions] Cleaning up Coinbase transaction state')
                setResult(prev => ({ ...prev, isLoading: false }))
            }
        },
        [writeContractsAsync, walletsReady, wallets],
    )

    const executeEoaTransactions = async (contractCalls: ContractCall[]) => {
        console.log('🔄 [useTransactions] Executing EOA transaction')

        try {
            setResult(prev => ({ ...prev, isLoading: true, isError: false, error: null }))

            console.log('📝 [useTransactions] Submitting EOA transaction')
            const result = await writeContractAsync(contractCalls[0])
            console.log('✅ [useTransactions] EOA transaction submitted', result)
        } catch (error) {
            console.error('❌ [useTransactions] EOA transaction error:', error)
            setResult(prev => ({
                ...prev,
                isError: true,
                error: error as Error,
            }))
            throw error
        }
    }

    const [currentTransaction, setCurrentTransaction] = useState<TransactionConfig | null>(null)

    const executeTransactions = useCallback(
        async (contractCalls: ContractCall[], config: TransactionConfig) => {
            console.log('🔄 [useTransactions] Executing transactions:', {
                calls: contractCalls,
                type: config.type,
                walletsReady,
                walletConnected: Boolean(wallets[0]),
                walletType: wallets[0]?.connectorType,
            })

            if (transactionInProgressRef.current) {
                console.log('⚠️ [useTransactions] Transaction already in progress, skipping')
                return
            }

            if (!walletsReady || !wallets[0]) {
                console.error('❌ [useTransactions] Wallet not ready or not connected')
                throw new Error('Wallet not ready or not connected')
            }

            try {
                setCurrentTransaction(config)
                transactionInProgressRef.current = true

                // Esperar un momento para asegurar que el conector esté listo
                await new Promise(resolve => setTimeout(resolve, 500))

                const walletType = wallets[0]?.connectorType
                console.log('🔍 [useTransactions] Using wallet type:', walletType)

                if (walletType === 'coinbase_wallet') {
                    await executeCoinbaseTransactions(contractCalls)
                } else {
                    await executeEoaTransactions(contractCalls)
                }
            } catch (error) {
                console.error('❌ [useTransactions] Transaction execution failed:', error)
                throw error
            } finally {
                transactionInProgressRef.current = false
            }
        },
        [walletsReady, wallets, executeCoinbaseTransactions, executeEoaTransactions],
    )

    return {
        executeTransactions,
        isConfirmed,
        resetConfirmation,
        isPending: isPaymasterPending,
        isReady: walletsReady,
        result: {
            ...result,
            receipt,
            isConfirming,
            callsStatus,
            transactionType: currentTransaction?.type,
        },
    }
}
