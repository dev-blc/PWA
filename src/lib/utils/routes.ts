import getAppUrl from '@/lib/utils/get-app-url'
import type { Route } from 'next'
import { z } from 'zod'

// Define route schemas
const appRouteSchema = z.enum([
    '/',
    '/my-pools',
    '/participant/[participant-id]',
    '/pool/[pool-id]',
    '/pool/[pool-id]/admin',
    '/pool/[pool-id]/check-in',
    '/pool/[pool-id]/edit',
    '/pool/[pool-id]/participants',
    '/pool/[pool-id]/participants/[participant-id]',
    '/pool/[pool-id]/participants/[participant-id]/refund',
    '/pool/[pool-id]/participants/payout-scan',
    '/pool/[pool-id]/ticket',
    '/pool/new',
    '/pools',
    '/profile',
    '/profile/claim-winning',
    '/profile/edit',
    '/profile/new',
    '/profile/request-refund',
])
const landingRouteSchema = z.enum(['/', '/privacy-policy', '/terms'])

// Create types from the schemas
type AppRoute = z.infer<typeof appRouteSchema>
type LandingRoute = z.infer<typeof landingRouteSchema>
type AllRoutes = AppRoute | LandingRoute

// Function to determine if we're in the app or on the landing page
const isInApp = () => {
    // This is a simple check. You might need to adjust this based on your actual setup
    return typeof window !== 'undefined' && window.location.hostname.includes('app.')
}

// Function to get the correct route
const getRoute = (path: AllRoutes): Route => {
    if (isInApp()) {
        // If we're in the app, use the app URL
        // if (appRouteSchema.safeParse(path).success) {
        return getAppUrl(`/${path}`)
        // }
        // throw new Error(`Invalid app route: ${path}`)
    } else {
        // If we're on the landing page, use the relative path
        // if (landingRouteSchema.safeParse(path).success) {
        return `/${path}` as Route
        // }
        // throw new Error(`Invalid landing route: ${path}`)
    }
}

// Create the route object
const route = {} as Record<AllRoutes, Route>

// Populate app routes
appRouteSchema.options.forEach(r => {
    route[r] = getRoute(r)
})

// Populate landing routes
landingRouteSchema.options.forEach(r => {
    route[r] = getRoute(r)
})

export default route
