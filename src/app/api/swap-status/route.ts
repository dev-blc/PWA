import 'server-only'

import { CONFIG } from '@/app/(pages)/profile/cross-swap/_components/config'
import type { APIResponse } from '@/app/(pages)/profile/cross-swap/types'
import { NextResponse } from 'next/server'

async function fetchFromOKX<T>(endpoint: keyof typeof CONFIG.API.ENDPOINTS, data: Record<string, unknown>) {
    const { BASE_URL, ENDPOINTS, HEADERS } = CONFIG.API
    const { path, call } = ENDPOINTS[endpoint]

    const url = new URL(path, BASE_URL)
    if (call === 'GET') {
        Object.entries(data).forEach(([key, value]) => {
            url.searchParams.append(key, String(value))
        })
    }

    const response = await fetch(url, {
        method: call,
        headers: HEADERS as Record<string, string>,
        body: call === 'POST' ? JSON.stringify(data) : undefined,
    })

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }

    return response.json() as Promise<APIResponse<T>>
}

export async function POST(req: Request) {
    try {
        const requestData = (await req.json()) as Record<string, unknown>
        const { txnHash } = requestData

        const response = await fetchFromOKX<unknown>('status', { hash: txnHash })

        if (response.code !== '0') {
            return NextResponse.json({ message: 'Error in the server response' }, { status: 400 })
        }

        if (response.msg !== 'success') {
            return NextResponse.json({ message: response.msg || 'Unknown error' }, { status: 500 })
        }

        return NextResponse.json({ data: response.data }, { status: 200 })
    } catch (error) {
        console.error('Error in the API:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}
