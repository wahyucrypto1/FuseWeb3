import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 })
    }

    // Mock NFT collections data
    const mockCollections = [
      {
        contractAddress: `0x${Math.random().toString(16).slice(2).padEnd(40, "0")}`,
        name: "Meme NFT Collection",
        symbol: "MEME",
        totalSupply: Math.floor(Math.random() * 100) + 1,
        deployedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
      },
      {
        contractAddress: `0x${Math.random().toString(16).slice(2).padEnd(40, "0")}`,
        name: "Video NFT Series",
        symbol: "VNFT",
        totalSupply: Math.floor(Math.random() * 50) + 1,
        deployedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
      },
    ]

    return NextResponse.json({
      collections: mockCollections,
      totalCollections: mockCollections.length,
    })
  } catch (error) {
    console.error("NFT collections error:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}
