"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "./wallet-provider"
import { AlertCircle, CheckCircle, Loader, Copy } from "lucide-react"

interface TokenDeploymentResult {
  tokenAddress: string
  transactionHash: string
  gasUsed: string
  gasPrice: string
  totalSupply: string
}

interface GasEstimate {
  gasEstimate: string
  estimatedGas: number
  gasPrice: string
}

export function ERC20Deployer() {
  const { isConnected, account, chainId, switchNetwork } = useWallet()
  const [tokenName, setTokenName] = useState("FuseToken")
  const [symbol, setSymbol] = useState("FUSE")
  const [decimals, setDecimals] = useState("18")
  const [initialSupply, setInitialSupply] = useState("1000000")
  const [description, setDescription] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<TokenDeploymentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null)
  const [deploymentStep, setDeploymentStep] = useState<"idle" | "estimating" | "deploying" | "success">("idle")
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const estimateGas = async () => {
    if (!isConnected) {
      setError("Please connect wallet first")
      return
    }

    if (!tokenName.trim() || !symbol.trim()) {
      setError("Please fill in token name and symbol")
      return
    }

    setIsEstimating(true)
    setError(null)
    setDeploymentStep("estimating")

    try {
      const response = await fetch("/api/estimate-erc20-gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenName,
          symbol,
          decimals: Number.parseInt(decimals),
          initialSupply,
          chainId: chainId || 122,
        }),
      })

      if (!response.ok) throw new Error("Failed to estimate gas")
      const data = await response.json()
      setGasEstimate(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to estimate gas")
      setDeploymentStep("idle")
    } finally {
      setIsEstimating(false)
    }
  }

  const deployToken = async () => {
    if (!isConnected) {
      setError("Please connect wallet first")
      return
    }

    if (!tokenName.trim() || !symbol.trim()) {
      setError("Please fill in all required fields")
      return
    }

    const fuseChainId = 122
    if (chainId !== fuseChainId) {
      try {
        await switchNetwork(fuseChainId)
      } catch (err) {
        setError("Failed to switch to Fuse network")
        return
      }
    }

    setIsDeploying(true)
    setError(null)
    setDeploymentStep("deploying")

    try {
      const response = await fetch("/api/deploy-erc20", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenName,
          symbol,
          decimals: Number.parseInt(decimals),
          initialSupply,
          description,
          deployerAddress: account,
          chainId: chainId || 122,
        }),
      })

      if (!response.ok) throw new Error("Failed to deploy token")
      const data = await response.json()
      setDeploymentResult(data)
      setDeploymentStep("success")

      setTokenName("FuseToken")
      setSymbol("FUSE")
      setDecimals("18")
      setInitialSupply("1000000")
      setDescription("")
      setGasEstimate(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Deployment failed")
      setDeploymentStep("idle")
    } finally {
      setIsDeploying(false)
    }
  }

  const resetDeployment = () => {
    setDeploymentResult(null)
    setDeploymentStep("idle")
    setGasEstimate(null)
    setError(null)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm p-6 hover:border-border/80 transition-all duration-300">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
          Deploy ERC20 Token
        </h2>

        {deploymentStep === "success" && deploymentResult ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 font-semibold">Token Deployed Successfully!</p>
                <p className="text-green-200 text-sm mt-1">Your ERC20 token is now live on the Fuse network.</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Token Address</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-primary font-mono break-all text-sm">{deploymentResult.tokenAddress}</p>
                  <button
                    onClick={() => copyToClipboard(deploymentResult.tokenAddress, "tokenAddress")}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Transaction Hash</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-primary font-mono break-all text-xs">{deploymentResult.transactionHash}</p>
                  <button
                    onClick={() => copyToClipboard(deploymentResult.transactionHash, "txHash")}
                    className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Gas Used</p>
                  <p className="text-foreground font-semibold">{deploymentResult.gasUsed}</p>
                </div>
                <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Gas Price</p>
                  <p className="text-foreground font-semibold">{deploymentResult.gasPrice} GWEI</p>
                </div>
              </div>

              <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Total Supply</p>
                <p className="text-foreground font-semibold">{deploymentResult.totalSupply}</p>
              </div>
            </div>

            <Button
              onClick={resetDeployment}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
            >
              Deploy Another Token
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Token Name *</label>
                <Input
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  placeholder="e.g., FuseToken"
                  disabled={isDeploying}
                  className="transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Symbol *</label>
                <Input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g., FUSE"
                  disabled={isDeploying}
                  maxLength={10}
                  className="transition-all duration-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Decimals</label>
                <Input
                  type="number"
                  value={decimals}
                  onChange={(e) => setDecimals(e.target.value)}
                  placeholder="18"
                  disabled={isDeploying}
                  min="0"
                  max="18"
                  className="transition-all duration-300"
                />
                <p className="text-xs text-muted-foreground mt-1">Usually 18 for standard tokens</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Initial Supply *</label>
                <Input
                  value={initialSupply}
                  onChange={(e) => setInitialSupply(e.target.value)}
                  placeholder="1000000"
                  disabled={isDeploying}
                  className="transition-all duration-300"
                />
                <p className="text-xs text-muted-foreground mt-1">Total tokens to mint initially</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your token..."
                disabled={isDeploying}
                className="min-h-20 transition-all duration-300"
              />
            </div>

            {gasEstimate && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 animate-fade-in-up">
                <p className="text-blue-300 font-semibold mb-2">Gas Estimate</p>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-blue-200/70">Estimated Gas</p>
                    <p className="text-blue-300 font-mono">{gasEstimate.estimatedGas.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-blue-200/70">Gas Price</p>
                    <p className="text-blue-300 font-mono">{gasEstimate.gasPrice} GWEI</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-blue-200/70">Estimated Cost</p>
                    <p className="text-blue-300 font-mono">{gasEstimate.gasEstimate} FUSE</p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4 flex items-start gap-3 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                onClick={estimateGas}
                disabled={isEstimating || isDeploying || !isConnected}
                variant="outline"
                className="flex-1 transition-all duration-300 bg-transparent"
              >
                {isEstimating ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Estimating...
                  </>
                ) : (
                  "Estimate Gas"
                )}
              </Button>
              <Button
                onClick={deployToken}
                disabled={isDeploying || !isConnected}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 transition-all duration-300"
              >
                {isDeploying ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  "Deploy Token"
                )}
              </Button>
            </div>

            {!isConnected && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 text-yellow-300 text-sm">
                Please connect your wallet to deploy a token
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">About ERC20 Tokens</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>ERC20 is the standard for fungible tokens on Ethereum and compatible networks.</p>
          <p>Deploy your own token with custom supply, decimals, and properties on the Fuse network.</p>
          <p>Tokens can be transferred, traded, and integrated with DeFi protocols.</p>
        </div>
      </Card>
    </div>
  )
}
