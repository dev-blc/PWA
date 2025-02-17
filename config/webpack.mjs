// @ts-check

/** @type {import('next').NextConfig['webpack']} */
export const configureWebpack = (config, options) => {
    const { isServer } = options

    // Existing config for tests
    config.module.rules.push({
        test: /\.test\.tsx?$/,
        loader: 'ignore-loader',
    })

    // Config for resolving the punycode warning
    if (!isServer) {
        config.resolve = {
            ...config.resolve,
            fallback: {
                ...config.resolve?.fallback,
                punycode: false,
            },
        }

        // Add chunk optimization only for the client
        config.optimization = {
            ...config.optimization,
            splitChunks: {
                chunks: 'all',
                minSize: 20000,
                maxSize: 244000,
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1]
                            return `vendor.${packageName.replace('@', '')}`
                        },
                        priority: 20,
                    },
                    common: {
                        minChunks: 2,
                        priority: 10,
                        reuseExistingChunk: true,
                    },
                },
            },
        }
    }

    return config
}
