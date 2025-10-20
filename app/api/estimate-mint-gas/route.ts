import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { contractAddress, recipientAddress, tokenURI } = await request.json()

    if (!contractAddress || !recipientAddress || !tokenURI) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Base gas for mint operation
    let estimatedGas = 150000

    // Add extra gas for URI storage
    if (tokenURI && tokenURI.length > 0) {
      estimatedGas += Math.ceil(tokenURI.length / 32) * 20000
    }

    // Get gas price from Fuse network
    const rpcUrl = "https://rpc.fuse.io"

    const gasPriceRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_gasPrice",
        params: [],
        id: 1,
      }),
    })

    const gasPriceData = await gasPriceRes.json()
    const gasPrice = Number.parseInt(gasPriceData.result || "0x1", 16)
    const gasPriceInGwei = gasPrice / 1e9

    const totalCostInWei = estimatedGas * gasPrice
    const totalCostInFuse = totalCostInWei / 1e18

    return NextResponse.json({
      estimatedGas,
      gasPrice: gasPriceInGwei.toFixed(2),
      estimatedCost: totalCostInFuse.toFixed(6),
      totalCostInWei: totalCostInWei.toString(),
    })
  } catch (error) {
    console.error("Mint gas estimation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to estimate gas" },
      { status: 500 },
    )
  }
}
