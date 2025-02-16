'use client'

import { enable$GetSet } from '@legendapp/state/config/enable$GetSet'
import { enableReactTracking } from '@legendapp/state/config/enableReactTracking'
import type { ReactNode } from 'react'

// Global Legend State configuration
enable$GetSet()
enableReactTracking({
    warnMissingUse: true, // Helps detect incorrect usage in development
})

export interface AppStoreProviderProps {
    children: ReactNode
}

// We no longer need a real provider, we just use this component
// to ensure the configuration runs once
export const AppStoreProvider = ({ children }: AppStoreProviderProps) => {
    return children
}
