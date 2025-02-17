import { CONFIG } from '../_components/config'
import type { SwapAction, SwapState, Token } from '../types'

const initialTokens: Token[] = [CONFIG.CHAIN.BASE.tokens.USDC]

export const initialSwapState: SwapState = {
    fromNetwork: {
        chainId: CONFIG.CHAIN.BASE.chainId,
        chainName: CONFIG.CHAIN.BASE.chainName,
        platformId: CONFIG.CHAIN.BASE.platformId,
        nativeCurrency: CONFIG.CHAIN.BASE.nativeCurrency,
        rpcUrls: [...CONFIG.CHAIN.BASE.rpcUrls],
        blockExplorerUrls: [...CONFIG.CHAIN.BASE.blockExplorerUrls],
    },
    fromToken: initialTokens[0],
    fromAmount: '0.0',
    receivedAmount: '0.0',
    isApproved: false,
    routerInfo: null,
    isLoading: false,
}

export function swapReducer(state: SwapState, action: SwapAction): SwapState {
    switch (action.type) {
        case 'SET_FROM_NETWORK':
            return { ...state, fromNetwork: action.payload }
        case 'SET_FROM_TOKEN':
            return { ...state, fromToken: action.payload }
        case 'SET_FROM_AMOUNT':
            return { ...state, fromAmount: action.payload }
        case 'SET_RECEIVED_AMOUNT':
            return { ...state, receivedAmount: action.payload }
        case 'SET_APPROVAL_STATUS':
            return { ...state, isApproved: action.payload }
        case 'SET_ROUTER_INFO':
            return { ...state, routerInfo: action.payload }
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload }
        default:
            return state
    }
}
