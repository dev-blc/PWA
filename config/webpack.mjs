// @ts-check

/** @type {import('next').NextConfig['webpack']} */
export const configureWebpack = (config, { isServer, nextRuntime }) => {
    // Config for tests
    config.module.rules.push({
        test: /\.test\.tsx?$/,
        loader: 'ignore-loader',
    })

    // Server-side externals
    if (isServer) {
        config.externals = [
            ...(Array.isArray(config.externals) ? config.externals : []),
            function ({ request }, callback) {
                if (['@privy-io/server-auth', 'crypto', 'stream', 'querystring', 'path'].includes(request)) {
                    return callback(null, `commonjs ${request}`)
                }
                callback()
            },
        ]
    }

    return config
}
