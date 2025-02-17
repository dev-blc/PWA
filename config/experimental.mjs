// @ts-check

import { inProduction } from '../src/app/_lib/utils/environment.mjs'

const turboEnabled = process.env.TURBO === 'true'

/** @type {import('next').NextConfig['experimental']} */
export const experimentalConfig = {
    typedRoutes: !inProduction && !turboEnabled,
    optimizeServerReact: true,
    optimizePackageImports: [
        'date-fns',
        'lucide-react',
        '@serwist/next',
        'motion/react',
        '@privy-io/react-auth',
        '@privy-io/wagmi',
        '@tanstack/react-query',
    ],
    serverActions: {
        allowedOrigins: ['app.poolparty.cc'],
    },
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'INP', 'TTFB'],
}
