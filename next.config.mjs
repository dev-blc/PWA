// @ts-check

import bundleAnalyzer from '@next/bundle-analyzer'
import { execSync } from 'node:child_process'
import { compilerConfig } from './config/compiler.mjs'
import { experimentalConfig } from './config/experimental.mjs'
import { imageConfig } from './config/images.mjs'
import { getRewriteRules } from './config/rewrites.mjs'
import { getSecurityHeaders } from './config/security.mjs'
import { withSerwist } from './config/serwist.mjs'
import { configureWebpack } from './config/webpack.mjs'

const withBundleAnalyzer = bundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const baseConfig = {
    compiler: compilerConfig,
    eslint: { ignoreDuringBuilds: true },
    experimental: experimentalConfig,
    headers: getSecurityHeaders,
    images: imageConfig,
    reactStrictMode: true,
    rewrites: getRewriteRules,
    webpack: configureWebpack,

    // Base configuration
    poweredByHeader: false,
    compress: true,

    // Critical server-side configuration
    serverComponentsExternalPackages: ['@privy-io/server-auth'],
    serverExternalPackages: ['@privy-io/server-auth', 'crypto', 'stream', 'querystring', 'path'],

    generateBuildId: () => execSync('git rev-parse HEAD').toString().trim(),
    productionBrowserSourceMaps: false,

    modularizeImports: {
        '@coinbase/wallet-sdk': {
            transform: '@coinbase/wallet-sdk/dist/{{member}}',
            skipDefaultConversion: true,
        },
    },
}

export default withBundleAnalyzer(withSerwist(baseConfig))
