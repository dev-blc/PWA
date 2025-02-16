// @ts-check

/** @type {import('next').NextConfig['webpack']} */
export const configureWebpack = (config, options) => {
    const { isServer } = options

    // Configuración existente para tests
    config.module.rules.push({
        test: /\.test\.tsx?$/,
        loader: 'ignore-loader',
    })

    // Configuración para resolver el warning de punycode
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
