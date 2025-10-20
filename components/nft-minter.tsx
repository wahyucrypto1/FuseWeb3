"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useWallet } from "./wallet-provider"
import { AlertCircle, CheckCircle, Loader, Copy } from "lucide-react"

interface MintResult {
  tokenId: string
  transactionHash: string
  gasUsed: string
  gasPrice: string
}

export function NFTMinter() {
  const { isConnected, account } = useWallet()
  const [contractAddress, setContractAddress] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [tokenURI, setTokenURI] = useState("")
  const [isMinting, setIsMinting] = useState(false)
  const [mintResult, setMintResult] = useState<MintResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [gasEstimate, setGasEstimate] = useState<string | null>(null)
  const [isEstimating, setIsEstimating] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  const estimateGas = async () => {
    if (!contractAddress || !recipientAddress || !tokenURI) {
      setError("Please fill in all fields to estimate gas")
      return
    }

    setIsEstimating(true)
    setError(null)

    try {
      const response = await fetch("/api/estimate-mint-gas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractAddress,
          recipientAddress,
          tokenURI,
        }),
      })

      if (!response.ok) throw new Error("Failed to estimate gas")
      const data = await response.json()
      setGasEstimate(data.estimatedCost)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to estimate gas")
    } finally {
      setIsEstimating(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const mintNFT = async () => {
    if (!contractAddress || !recipientAddress || !tokenURI) {
      setError("Please fill in all fields")
      return
    }

    if (!isConnected) {
      setError("Please connect wallet first")
      return
    }

    setIsMinting(true)
    setError(null)

    try {
      const response = await fetch("/api/mint-nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contractAddress,
          recipientAddress,
          tokenURI,
          minterAddress: account,
        }),
      })

      if (!response.ok) throw new Error("Failed to mint NFT")
      const data = await response.json()
      setMintResult(data)
      setContractAddress("")
      setRecipientAddress("")
      setTokenURI("")
      setGasEstimate(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Minting failed")
    } finally {
      setIsMinting(false)
    }
  }

  const resetMinting = () => {
    setMintResult(null)
    setError(null)
    setGasEstimate(null)
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm p-6 hover:border-border/80 transition-all duration-300">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
          Mint NFT
        </h2>

        {mintResult ? (
          <div className="space-y-4 animate-fade-in-up">
            <div className="bg-green-900/20 border border-green-700/50 rounded-lg p-4 flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-green-300 font-semibold">NFT Minted Successfully!</p>
                <p className="text-green-200 text-sm mt-1">Your NFT has been created and assigned to the recipient.</p>
              </div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Token ID</p>
                <div className="flex items-center justify-between">
                  <p className="text-primary font-mono">{mintResult.tokenId}</p>
                  <button
                    onClick={() => copyToClipboard(mintResult.tokenId, "tokenId")}
                    className={`transition-colors ${copiedField === "tokenId" ? "text-green-400" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Transaction Hash</p>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-primary font-mono break-all text-xs">{mintResult.transactionHash}</p>
                  <button
                    onClick={() => copyToClipboard(mintResult.transactionHash, "txHash")}
                    className={`transition-colors flex-shrink-0 ${copiedField === "txHash" ? "text-green-400" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Gas Used</p>
                  <p className="text-foreground font-semibold">{mintResult.gasUsed}</p>
                </div>
                <div className="bg-card/50 p-3 rounded-lg border border-border/50">
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Gas Price</p>
                  <p className="text-foreground font-semibold">{mintResult.gasPrice} GWEI</p>
                </div>
              </div>
            </div>

            <Button
              onClick={resetMinting}
              className="w-full bg-gradient-to-r from-primary to-accent hover:opacity-90 transition-all duration-300"
            >
              Mint Another NFT
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Contract Address *</label>
              <Input
                value={contractAddress}
                onChange={(e) => setContractAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono transition-all duration-300"
                disabled={isMinting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Recipient Address *</label>
              <Input
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder="0x..."
                className="font-mono transition-all duration-300"
                disabled={isMinting}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Token URI (IPFS or HTTP) *</label>
              <Input
                value={tokenURI}
                onChange={(e) => setTokenURI(e.target.value)}
                placeholder="https://ipfs.io/ipfs/... or https://api.example.com/metadata/1"
                className="transition-all duration-300"
                disabled={isMinting}
              />
              <p className="text-xs text-muted-foreground mt-1">URL pointing to the NFT metadata JSON</p>
            </div>

            {gasEstimate && (
              <div className="bg-blue-900/20 border border-blue-700/50 rounded-lg p-4 animate-fade-in-up">
                <p className="text-blue-300 font-semibold mb-2">Estimated Minting Cost</p>
                <p className="text-blue-300 font-mono">{gasEstimate} FUSE</p>
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
                disabled={isEstimating || isMinting || !isConnected}
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
                onClick={mintNFT}
                disabled={isMinting || !isConnected}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:opacity-90 disabled:opacity-50 transition-all duration-300"
              >
                {isMinting ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Minting...
                  </>
                ) : (
                  "Mint NFT"
                )}
              </Button>
            </div>

            {!isConnected && (
              <div className="bg-yellow-900/20 border border-yellow-700/50 rounded-lg p-3 text-yellow-300 text-sm">
                Please connect your wallet to mint an NFT
              </div>
            )}
          </div>
        )}
      </Card>

      <Card className="bg-gradient-to-br from-card/80 to-card/40 border-border/50 backdrop-blur-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-3">Minting Guide</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>1. Enter the ERC721 contract address you deployed</p>
          <p>2. Specify the recipient wallet address for the NFT</p>
          <p>3. Provide a URI pointing to the NFT metadata (JSON format)</p>
          <p>4. Estimate gas costs before minting</p>
          <p>5. Confirm the transaction in your wallet</p>
        </div>
      </Card>
    </div>
  )
}
