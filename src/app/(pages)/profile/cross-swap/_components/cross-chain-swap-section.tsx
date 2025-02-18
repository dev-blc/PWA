"use client"

import { Sheet, SheetContent } from "@/app/_components/ui/sheet"
import { useWallets } from "@privy-io/react-auth"
// import { toNumber } from 'lodash'
import dynamic from "next/dynamic"
import { useState } from "react"
import { toast } from "sonner"
import { useSwapContext } from "../context/SwapContext"
import type { OKXToken } from "../types"
import { ActionButton } from "./ActionButton"
import type { BridgeInfoCardProps } from "./bridge-card"
import { FromSection } from "./FromSection"
import { useNetworkFetching } from "./hooks/useNetworkFetching"
import { useRouteCalculation } from "./hooks/useRouteCalculation"
import { useSheetDrag } from "./hooks/useSheetDrag"
import { useSwapExecution } from "./hooks/useSwapExecution"
import { useTokenSelection } from "./hooks/useTokenSelection"
import { useTransactionHistory } from "./hooks/useTransactionHistory"
import type { TokenSelectorProps } from "./TokenSelector"
import { ToSection } from "./ToSection"
import { TransactionHistory } from "./tx-history"

// Componentes dinámicos con tipos correctos
const TokenSelectorDynamic = dynamic<TokenSelectorProps>(
    () => import("./TokenSelector").then(mod => mod.TokenSelector),
    {
        loading: () => <div>Loading...</div>,
        ssr: false,
    },
)

const BridgeInfoCardDynamic = dynamic<BridgeInfoCardProps>(
    () => import("./bridge-card").then(mod => mod.BridgeInfoCard),
    {
        loading: () => <div>Loading...</div>,
        ssr: false,
    },
)

const CrossChainSwapSection = () => {
    const { wallets } = useWallets()
    const { state, dispatch } = useSwapContext()
    const [isSelectOpen, setIsSelectOpen] = useState(false)
    const [isSwapping, setIsSwapping] = useState(false)
    const [isHistoryOpen, setHistory] = useState(false)
    const { fetchedNetworks } = useNetworkFetching(wallets)
    const { selectedNetwork, searchQuery, setSelectedNetwork, setSearchQuery, filteredTokens } = useTokenSelection({
        fromNetwork: state.fromNetwork,
    })
    // console.log(
    //     'd;;;;;;ata',
    //     state.fromNetwork,
    //     state.fromToken,
    //     state.fromAmount,
    //     wallets[0]?.address,
    //     selectedNetwork,
    //     searchQuery,
    //     filteredTokens,
    // )
    useRouteCalculation({
        fromNetwork: state.fromNetwork,
        fromToken: state.fromToken,
        fromAmount: state.fromAmount,
        walletAddress: wallets[0]?.address,
        dispatch,
    })

    const transactionHistory = useTransactionHistory({
        fetchedNetworks,
        fetchedTokens: filteredTokens,
        walletAddress: wallets[0]?.address,
    })

    const { approve, swap } = useSwapExecution({
        fromNetwork: state.fromNetwork,
        fromToken: state.fromToken,
        fromAmount: state.fromAmount,
        onSwapComplete: () => toast.message("Transaction submitted"),
    })

    const { sheetRef } = useSheetDrag(() => setIsSelectOpen(false))

    const handleFromTokenSelect = (token: OKXToken) => {
        dispatch({ type: "SET_FROM_TOKEN", payload: token })
        setIsSelectOpen(false)
    }

    const handleFromAmountChange = (amount: string) => {
        dispatch({ type: "SET_FROM_AMOUNT", payload: amount })
    }

    const handleApprove = () => {
        try {
            approve()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Approval failed")
        }
    }

    const handleSwap = () => {
        try {
            setIsSwapping(true)
            swap()
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Swap failed")
        } finally {
            setIsSwapping(false)
        }
    }

    const handleNetworkSelect = (networkId: string) => {
        if (networkId === "all") {
            return
        }

        const selectedNetwork = fetchedNetworks.find(n => n.chainId === networkId)
        if (selectedNetwork) {
            dispatch({ type: "SET_FROM_NETWORK", payload: selectedNetwork })
            // Reset token-related states when network changes
            dispatch({ type: "SET_FROM_TOKEN", payload: state.fromToken }) // Reset token selection
            dispatch({ type: "SET_FROM_AMOUNT", payload: "0.0" })
            dispatch({ type: "SET_RECEIVED_AMOUNT", payload: "0.0" })
            dispatch({ type: "SET_APPROVAL_STATUS", payload: false })
            dispatch({ type: "SET_ROUTER_INFO", payload: null })
            dispatch({ type: "SET_HISTORY", payload: transactionHistory.transactions })
            setSelectedNetwork(networkId)
        }
    }

    return (
        <div className='relative min-h-screen overflow-y-scroll [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
            {/* <WalletAccountSection /> */}
            <div className='mx-auto w-full max-w-md space-y-4 overflow-y-scroll p-1 pb-24'>
                <Sheet open={isSelectOpen} onOpenChange={setIsSelectOpen}>
                    <SheetContent ref={sheetRef} side='bottom' className='h-[85vh] touch-none rounded-t-[24px] p-4'>
                        <TokenSelectorDynamic
                            isOpen={isSelectOpen}
                            onClose={() => setIsSelectOpen(false)}
                            filteredTokens={filteredTokens}
                            selectedNetwork={selectedNetwork}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            onNetworkSelect={handleNetworkSelect}
                            onTokenSelect={handleFromTokenSelect}
                            networks={fetchedNetworks}
                        />
                    </SheetContent>
                </Sheet>

                <TransactionHistory
                    isOpen={isHistoryOpen}
                    transactions={transactionHistory.transactions}
                    networks={fetchedNetworks}
                    tokens={filteredTokens}
                />

                <div className='detail_card mx-auto w-full rounded-[24px]'>
                    <FromSection
                        fromNetwork={state.fromNetwork}
                        fromToken={state.fromToken}
                        fromAmount={state.fromAmount}
                        onSelectClick={() => setIsSelectOpen(true)}
                        onAmountChange={handleFromAmountChange}
                    />
                    <ToSection receivedAmount={state.receivedAmount} />
                </div>

                {state.routerInfo && <BridgeInfoCardDynamic bridgeInfo={state.routerInfo} />}
            </div>
            <ActionButton
                isApproved={state.isApproved}
                onApproveAction={handleApprove}
                onSwapAction={handleSwap}
                disabled={!state.fromAmount || Number(state.fromAmount) === 0 || isSwapping}
            />
            <button onClick={() => setHistory(true)}>test txn histiry</button>
        </div>
    )
}

export default CrossChainSwapSection
