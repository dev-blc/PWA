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
    }

    return config
}
