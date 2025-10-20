export interface TransactionConfig {
  gasLimit?: string
  gasPrice?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  nonce?: number
}

export interface TransactionResult {
  hash: string
  from: string
  to?: string
  value: string
  gasUsed: string
  gasPrice: string
  status: "success" | "failed" | "pending"
  blockNumber?: number
  timestamp: number
}

export interface GasEstimationResult {
  estimatedGas: number
  gasPrice: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
  estimatedCostInWei: string
  estimatedCostInEth: string
}

const MAX_RETRIES = 3
const RETRY_DELAY = 2000 // 2 seconds

export async function estimateTransactionGas(
  rpcUrl: string,
  from: string,
  to: string,
  data: string,
  value = "0",
): Promise<GasEstimationResult> {
  try {
    // Estimate gas
    const gasEstimateRes = await fetch(rpcUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "eth_estimateGas",
        params: [{ from, to, data, value }],
        id: 1,
      }),
    })

    const gasEstimateData = await gasEstimateRes.json()
    const estimatedGas = Number.parseInt(gasEstimateData.result || "0x0", 16)

    // Get gas price
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
    const gasPriceInGwei = (gasPrice / 1e9).toFixed(2)

    const estimatedCostInWei = (estimatedGas * gasPrice).toString()
    const estimatedCostInEth = ((estimatedGas * gasPrice) / 1e18).toFixed(6)

    return {
      estimatedGas,
      gasPrice: gasPriceInGwei,
      estimatedCostInWei,
      estimatedCostInEth,
    }
  } catch (error) {
    console.error("Gas estimation error:", error)
    throw new Error("Failed to estimate gas")
  }
}

export async function getTransactionStatus(
  rpcUrl: string,
  txHash: string,
  retries: number = MAX_RETRIES,
): Promise<TransactionResult | null> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          method: "eth_getTransactionReceipt",
          params: [txHash],
          id: 1,
        }),
      })

      const data = await response.json()

      if (data.result) {
        const receipt = data.result
        return {
          hash: receipt.transactionHash,
          from: receipt.from,
          to: receipt.to,
          value: receipt.value || "0",
          gasUsed: Number.parseInt(receipt.gasUsed, 16).toString(),
          gasPrice: (Number.parseInt(receipt.gasPrice, 16) / 1e9).toFixed(2),
          status: receipt.status === "0x1" ? "success" : "failed",
          blockNumber: Number.parseInt(receipt.blockNumber, 16),
          timestamp: Date.now(),
        }
      }

      // Transaction not yet mined, retry
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    } catch (error) {
      console.error(`Transaction status check attempt ${attempt + 1} failed:`, error)
      if (attempt < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY))
      }
    }
  }

  return null
}

export async function waitForTransaction(
  rpcUrl: string,
  txHash: string,
  maxWaitTime = 120000, // 2 minutes
): Promise<TransactionResult> {
  const startTime = Date.now()

  while (Date.now() - startTime < maxWaitTime) {
    const result = await getTransactionStatus(rpcUrl, txHash, 1)

    if (result) {
      return result
    }

    await new Promise((resolve) => setTimeout(resolve, 3000)) // Wait 3 seconds before retrying
  }

  throw new Error("Transaction confirmation timeout")
}

export function calculateGasPrice(baseGasPrice: number, multiplier = 1.1): string {
  return ((baseGasPrice * multiplier) / 1e9).toFixed(2)
}

export function formatGasPrice(weiValue: string): string {
  return (Number.parseInt(weiValue, 16) / 1e9).toFixed(2)
}

export function formatEthValue(weiValue: string): string {
  return (Number.parseInt(weiValue, 16) / 1e18).toFixed(6)
}
