import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import { PrivyProvider } from '@privy-io/react-auth'
import { base, baseGoerli, mainnet, goerli, baseSepolia } from 'viem/chains'
import { chain } from 'constants/constant'
import { PrivyWagmiConnector } from '@privy-io/wagmi-connector'
import { foundry } from 'wagmi/chains'
import { WagmiProvider, createConfig } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from '@/constants/config'
// import { http, createConfig } from 'wagmi'
// import { publicProvider } from 'wagmi/providers/public'
import Head from 'next/head'

import { Toaster } from '@/components/ui/toaster'

export default function App({ Component, pageProps }: AppProps) {
	// const configureChainsConfig = createConfig({
	// 	chains: [mainnet, goerli, foundry],
	// 	transports: {
	// 		[foundry.id]: http(),
	// 		[sepolia.id]: http(),
	// 	},
	// })

	const queryClient = new QueryClient()

	return (
		<>
			<Head>
				<meta
					name='viewport'
					content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
				/>
			</Head>

			<PrivyProvider
				appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
				// onSuccess={handleLogin}
				config={{
					loginMethods: [
						// 'google',
						'wallet',
						// 'farcaster',
					],
					appearance: {
						theme: 'light',
						accentColor: '#676FFF',
						logo: '/images/pool.png',
						// showWalletLoginFirst: false,
					},
					embeddedWallets: {
						createOnLogin: 'off',
						// createOnLogin: 'users-without-wallets',
						priceDisplay: {
							primary: 'native-token',
							secondary: null,
						},
					},

					defaultChain: chain,
					supportedChains: [
						base,
						baseSepolia,
						// baseGoerli,
						// mainnet,
						// goerli,
						// chain,
					],
					legal: {
						privacyPolicyUrl: '/privacy',
						termsAndConditionsUrl: '/terms',
					},
					fiatOnRamp: { useSandbox: true },
				}}
			>
				<WagmiProvider config={config}>
					<QueryClientProvider client={queryClient}>
						{/* <PrivyWagmiConnector wagmiChainsConfig={config}> */}
						<ThemeProvider
							attribute='class'
							defaultTheme='system'
							disableTransitionOnChange
						>
							<Component {...pageProps} />
							<Toaster />
						</ThemeProvider>
						{/* </PrivyWagmiConnector> */}
					</QueryClientProvider>
				</WagmiProvider>
			</PrivyProvider>
		</>
	)
}
