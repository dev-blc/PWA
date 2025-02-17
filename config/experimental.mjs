// @ts-check

import { inProduction } from '../src/app/_lib/utils/environment.mjs'

/** @type {import('next').NextConfig['experimental']} */
export const experimentalConfig = {
    typedRoutes: !inProduction,
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
    webVitalsAttribution: ['CLS', 'LCP', 'FID', 'INP', 'TTFB'],
    optimisticClientCache: true,
    serverMinification: true,
    turbo: {
        rules: {
            '*.svg': ['@svgr/webpack'],
        },
    },
}
