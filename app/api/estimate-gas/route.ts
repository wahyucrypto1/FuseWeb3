import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { contractName, symbol, baseURI, chainId } = await request.json()

    // Base gas for ERC721 deployment
    let estimatedGas = 2500000

    // Add extra gas if baseURI is provided (storage cost)
    if (baseURI && baseURI.length > 0) {
      estimatedGas += Math.ceil(baseURI.length / 32) * 20000
    }

    // Get current gas price from Fuse network
    const rpcUrl = chainId === 122 ? "https://rpc.fuse.io" : "https://rpc.fusespark.io"

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
      gasEstimate: totalCostInFuse.toFixed(6),
      estimatedGas,
      gasPrice: gasPriceInGwei.toFixed(2),
      totalCostInWei: totalCostInWei.toString(),
    })
  } catch (error) {
    console.error("Gas estimation error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to estimate gas" },
      { status: 500 },
    )
  }
}
