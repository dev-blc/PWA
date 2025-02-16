import { NextResponse, type NextRequest } from 'next/server'

export default function middleware(req: NextRequest) {
    const response = NextResponse.next()

    // Logging for debugging
    console.info('\x1b[35m[middleware]\x1b[0m', '🦩\t', '\x1b[36m' + req.nextUrl.pathname + '\x1b[0m')

    // Security headers
    response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload')
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // Protected routes that require authentication
    const PROTECTED_ROUTES = ['/profile', '/dashboard']
    const isProtectedRoute = PROTECTED_ROUTES.some(route => req.nextUrl.pathname.startsWith(route))

    // Verify Privy token
    const privyToken = req.cookies.get('privy-token')

    if (isProtectedRoute && !privyToken) {
        // Redirect to the main page if not authenticated
        return NextResponse.redirect(new URL('/', req.url))
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - API routes
         * - Next.js internals
         * - Public files
         * - Privy endpoints
         */
        '/((?!api|_next/static|_next/image|favicon.ico|public|.*\\..*|privy).*)',
    ],
}
