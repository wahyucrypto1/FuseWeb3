"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWallet } from "./wallet-provider"
import { AlertCircle, CheckCircle, Loader } from "lucide-react"

interface DeploymentResult {
  contractAddress: string
  transactionHash: string
  gasUsed: string
  gasPrice: string
  blockNumber?: string
}

interface GasEstimate {
  gasEstimate: string
  estimatedGas: number
  gasPrice: string
}

export function ContractDeployer() {
  const { isConnected, account, chainId, switchNetwork } = useWallet()
  const [contractName, setContractName] = useState("MemeNFT")
  const [symbol, setSymbol] = useState("MEME")
  const [baseURI, setBaseURI] = useState("")
  const [description, setDescription] = useState("")
  const [isDeploying, setIsDeploying] = useState(false)
  const [isEstimating, setIsEstimating] = useState(false)
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null)
  const [deploymentStep, setDeploymentStep] = useState<"idle" | "estimating" | "deploying" | "success">("idle")

  const estimateGas = async () => {
    if (!isConnected) {
      setError("Please connect wallet first")
      return
    }

    if (!contractName.trim() || !symbol.trim()) {
      setError("Please fill in contract name and symbol")
      return
    }

    setIsEstimating(true)
    setError(null)
    setDeploymentStep("estimating")

    try {
      const response = await fetch("/api/estimate-gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractName,
          symbol,
          baseURI,
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

  const deployContract = async () => {
    if (!isConnected) {
      setError("Please connect wallet first")
      return
    }

    if (!contractName.trim() || !symbol.trim()) {
      setError("Please fill in all required fields")
      return
    }

    // Ensure we're on Fuse network
    const fuseChainId = 122 // Fuse Mainnet
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
      const response = await fetch("/api/deploy-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractName,
          symbol,
          baseURI,
          description,
          deployerAddress: account,
          chainId: chainId || 122,
        }),
      })

      if (!response.ok) throw new Error("Failed to deploy contract")
      const data = await response.json()
      setDeploymentResult(data)
      setDeploymentStep("success")

      // Reset form
      setContractName("MemeNFT")
      setSymbol("MEME")
      setBaseURI("")
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
      {/* Main Deployment Card */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Deploy ERC721 Contract</h2>

        {deploymentStep === "success" && deploymentResult ? (
          <div className="space-y-4">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 font-semibold">Contract Deployed Successfully!</p>
                <p className="text-green-200 text-sm mt-1">Your NFT contract is now live on the Fuse network.</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-slate-900/50 p-3 rounded">
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Contract Address</p>
                <p className="text-cyan-400 font-mono break-all text-sm">{deploymentResult.contractAddress}</p>
              </div>
              <div className="bg-slate-900/50 p-3 rounded">
                <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Transaction Hash</p>
                <p className="text-cyan-400 font-mono break-all text-sm">{deploymentResult.transactionHash}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Gas Used</p>
                  <p className="text-white font-semibold">{deploymentResult.gasUsed}</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded">
                  <p className="text-slate-400 text-xs uppercase tracking-wide mb-1">Gas Price</p>
                  <p className="text-white font-semibold">{deploymentResult.gasPrice} GWEI</p>
                </div>
              </div>
            </div>

            <Button onClick={resetDeployment} className="w-full bg-cyan-600 hover:bg-cyan-700">
              Deploy Another Contract
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Contract Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contract Name *</label>
                <Input
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  placeholder="e.g., MemeNFT"
                  className="bg-slate-900 border-slate-700 text-white"
                  disabled={isDeploying}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Symbol *</label>
                <Input
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  placeholder="e.g., MEME"
                  className="bg-slate-900 border-slate-700 text-white"
                  disabled={isDeploying}
                  maxLength={10}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Base URI (IPFS or HTTP)</label>
              <Input
                value={baseURI}
                onChange={(e) => setBaseURI(e.target.value)}
                placeholder="https://ipfs.io/ipfs/... or https://api.example.com/metadata/"
                className="bg-slate-900 border-slate-700 text-white"
                disabled={isDeploying}
              />
              <p className="text-xs text-slate-400 mt-1">Optional: URL prefix for token metadata</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your NFT collection..."
                className="bg-slate-900 border-slate-700 text-white min-h-20"
                disabled={isDeploying}
              />
            </div>

            {/* Gas Estimate Display */}
            {gasEstimate && (
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
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

            {/* Error Display */}
            {error && (
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                onClick={estimateGas}
                disabled={isEstimating || isDeploying || !isConnected}
                variant="outline"
                className="flex-1 bg-transparent border-slate-600 hover:bg-slate-700"
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
                onClick={deployContract}
                disabled={isDeploying || !isConnected}
                className="flex-1 bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50"
              >
                {isDeploying ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  "Deploy Contract"
                )}
              </Button>
            </div>

            {!isConnected && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 text-yellow-300 text-sm">
                Please connect your wallet to deploy a contract
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Info Card */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <h3 className="text-lg font-semibold text-white mb-3">About ERC721 Contracts</h3>
        <div className="space-y-2 text-sm text-slate-300">
          <p>ERC721 is the standard for non-fungible tokens (NFTs) on Ethereum and compatible networks.</p>
          <p>
            Your contract will be deployed on the Fuse network, which offers low transaction fees and fast confirmation
            times.
          </p>
          <p>After deployment, you can mint NFTs using the contract address and manage your collection.</p>
        </div>
      </Card>
    </div>
  )
}
