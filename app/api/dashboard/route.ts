import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 })
    }

    // Mock dashboard stats
    return NextResponse.json({
      videosGenerated: Math.floor(Math.random() * 50),
      contractsDeployed: Math.floor(Math.random() * 10),
      nftsMinted: Math.floor(Math.random() * 100),
      totalGasSpent: (Math.random() * 10).toFixed(2),
    })
  } catch (error) {
    console.error("Dashboard error:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
