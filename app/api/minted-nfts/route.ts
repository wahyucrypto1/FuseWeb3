import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const address = request.nextUrl.searchParams.get("address")

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 })
    }

    // Mock minted NFTs data
    const mockNFTs = [
      {
        tokenId: Math.floor(Math.random() * 10000).toString(),
        contractAddress: `0x${Math.random().toString(16).slice(2).padEnd(40, "0")}`,
        recipientAddress: address,
        tokenURI: "https://ipfs.io/ipfs/QmExample1",
        mintedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
      },
      {
        tokenId: Math.floor(Math.random() * 10000).toString(),
        contractAddress: `0x${Math.random().toString(16).slice(2).padEnd(40, "0")}`,
        recipientAddress: address,
        tokenURI: "https://ipfs.io/ipfs/QmExample2",
        mintedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactionHash: `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`,
      },
    ]

    return NextResponse.json({
      nfts: mockNFTs,
      totalMinted: mockNFTs.length,
    })
  } catch (error) {
    console.error("Minted NFTs error:", error)
    return NextResponse.json({ error: "Failed to fetch minted NFTs" }, { status: 500 })
  }
}
