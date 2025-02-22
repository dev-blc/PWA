import { cookieStorage, createStorage, http } from 'wagmi'
import { base, baseSepolia } from 'viem/chains'
import { createConfig } from '@privy-io/wagmi'
import { Transport } from 'viem'

const network = process.env.NEXT_PUBLIC_NETWORK || 'development'

const chainConfig = {
    mainnet: base,
    testnet: baseSepolia,
    development: base,
}

const chain = chainConfig[network as keyof typeof chainConfig]
const transport = { [chain.id]: http(process.env.RPC_ENDPOINT) } as Record<number, Transport>

export function getConfig() {
    return createConfig({
        chains: [chain],
        multiInjectedProviderDiscovery: false,
        syncConnectedChain: true,
        transports: transport,
        ssr: true,
        storage: createStorage({
            storage: cookieStorage,
        }),
    })
}
