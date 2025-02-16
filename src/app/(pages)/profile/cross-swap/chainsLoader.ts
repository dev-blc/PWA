import chainsData from './_data/chains.json'
import type { Chain } from './_types/chain'
import { chainsSchema } from './_schemas/chainSchema'

export function loadChains(): Chain[] {
    try {
        const validatedData = chainsSchema.parse(chainsData)
        return validatedData.chains
    } catch (error) {
        console.error('Error validating chains data:', error)
        throw error
    }
}
