import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { tokenName, symbol, decimals, initialSupply, chainId } = await request.json()

    // Validate inputs
    if (!tokenName || !symbol || !initialSupply || !chainId || !decimals) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Mock gas estimation for ERC20
    const baseGas = 800000
    const supplyMultiplier = Math.log10(Number.parseInt(initialSupply) || 1) * 10000
    const estimatedGas = Math.floor(baseGas + supplyMultiplier)
    const gasPrice = (Math.random() * 50 + 1).toFixed(2)
    const estimatedCost = ((estimatedGas * Number.parseFloat(gasPrice)) / 1e9).toFixed(4)

    return NextResponse.json({
      gasEstimate: `${estimatedCost} FUSE`,
      estimatedGas,
      gasPrice: `${gasPrice}`,
    })
  } catch (error) {
    console.error("Gas estimation error:", error)
    return NextResponse.json({ error: "Failed to estimate gas" }, { status: 500 })
  }
}
