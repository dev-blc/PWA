import "server-only"

import { HttpClient } from "@/app/(pages)/profile/cross-swap/_components/api/http-client"
import { CONFIG } from "@/app/(pages)/profile/cross-swap/_components/config"
import { OKXSwapStatus } from "@/app/(pages)/profile/cross-swap/types"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    try {
        const httpClient = HttpClient.getInstance()

        const requestData = (await req.json()) as Record<string, unknown>

        const response = await httpClient.get<OKXSwapStatus[]>(CONFIG.API.ENDPOINTS.status.path, requestData)
        console.log("Response from OKX:", response)
        if (response.code !== "0") {
            return NextResponse.json({ message: "Error in the server response" }, { status: 400 })
        }
        return NextResponse.json({ data: response.data }, { status: 200 })
    } catch (error) {
        console.error("Error in the API:", error)
        return NextResponse.json({ message: "Internal server error" }, { status: 500 })
    }
}
