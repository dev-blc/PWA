import type { ERROR_CODES } from './_components/utils/errors'

// Base API Types
export type HTTPMethod = 'GET' | 'POST'

export type APIEndpoint = {
    path: string
    call: HTTPMethod
}

// Error Types
export type APIErrorCode = keyof typeof ERROR_CODES

export type APIResponse<T> = {
    code: string
    data: T
    msg?: string
}

export interface APIError {
    code: APIErrorCode
    msg: string
    data?: unknown
}

// Chain and Network Types
export interface NativeCurrency {
    name: string
    symbol: string
    decimals: number
}

export interface Explorer {
    name: string
    url: string
    standard: string
}

export interface Chain {
    name: string
    chain: string
    rpc: string[]
    faucets: string[]
    nativeCurrency: NativeCurrency
    infoURL: string
    shortName: string
    chainId: number
    networkId: number
    slip44?: number
    status?: string
    explorers?: Explorer[]
}

export interface Network {
    chainId: string
    chainName: string
    platformId?: number
    nativeCurrency?: NativeCurrency
    rpcUrls?: string[]
    blockExplorerUrls?: string[]
}

export interface OKXNetwork {
    chainId: string
    chainName: string
    dexTokenApproveAddress: string
}

export interface ChainsData {
    chains: Chain[]
}

// Token Types
export interface Token {
    chainId?: string
    chainName?: string
    decimals: string
    tokenContractAddress: string
    tokenLogoUrl: string
    tokenName: string
    tokenSymbol: string
    dexTokenApproveAddress?: string
}

// Bridge Types
export interface BridgeInfo {
    protocol: string
    rate: {
        from: {
            amount: string
            token: string
        }
        to: {
            amount: string
            token: string
        }
    }
    fee: {
        networkFee: string
        token: string
    }
    estimatedTime: string
    slippage: string
}

// Request/Response Types
export interface ApprovalStatusRequest {
    userWalletAddress: string
    tokenContractAddress: string
    chainId: number
    defiPlatformIds: number
}

export interface ApprovalStatusResponse {
    [platformId: number]: {
        amount: string
        status?: string
    }
}

export interface TransactionStatusRequest {
    hash: string
}

export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'INVALID'

export interface TransactionStatusResponse {
    status: TransactionStatus
    hash: string
    timestamp: string
}

export interface OKXAccountRequest {
    addresses: Array<{
        chainIndex: string
        address: string
    }>
}

export interface OKXAccountResponse {
    address: string
    chainIndex: string
    status: string
    createdAt?: string
    updatedAt?: string
}

// State Management Types
export interface SwapState {
    fromNetwork: Network
    fromToken: Token
    fromAmount: string
    receivedAmount: string
    isApproved: boolean
    routerInfo: BridgeInfo | null
    isLoading?: boolean
}

export type SwapAction =
    | { type: 'SET_FROM_NETWORK'; payload: Network }
    | { type: 'SET_FROM_TOKEN'; payload: Token }
    | { type: 'SET_FROM_AMOUNT'; payload: string }
    | { type: 'SET_RECEIVED_AMOUNT'; payload: string }
    | { type: 'SET_APPROVAL_STATUS'; payload: boolean }
    | { type: 'SET_ROUTER_INFO'; payload: BridgeInfo | null }
    | { type: 'SET_LOADING'; payload: boolean }

// Route Calculation Types
export interface RouteCalculationProps {
    fromNetwork: Network
    fromToken: Token
    fromAmount: string
    walletAddress: string
    dispatch: React.Dispatch<SwapAction>
}

export interface RouterListItem {
    toTokenAmount: string
    fromChainNetworkFee: string
    estimateTime: string
    router: {
        bridgeName: string
    }
}

export interface RouteResponseData {
    routerList: RouterListItem[]
}

// Fix: Use APIResponse generic type correctly
export type RouteResponse = APIResponse<RouteResponseData>

// API Response Types
export type ApproveResponse = APIResponse<
    {
        tx: {
            to: string
            data: string
            value: string
            gasLimit: string
            gasPrice: string
        }
        data?: string
        gasLimit?: string
        gasPrice?: string
    }[]
>

export type SwapResponse = APIResponse<
    {
        tx: {
            to: string
            data: string
            value: string
            gasLimit: string
            gasPrice: string
            chainId?: string
        }
    }[]
>

export type ChainsResponse = APIResponse<Chain[]>

export type TokensResponse = APIResponse<Token[]>

export interface TokenSelectionProps {
    fromNetwork: Network
}
