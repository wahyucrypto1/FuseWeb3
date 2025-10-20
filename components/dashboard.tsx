"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWallet } from "./wallet-provider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Copy, ExternalLink, Loader } from "lucide-react"

interface DashboardStats {
  videosGenerated: number
  contractsDeployed: number
  nftsMinted: number
  totalGasSpent: string
}

interface NFTCollection {
  contractAddress: string
  name: string
  symbol: string
  totalSupply: number
  deployedAt: string
  transactionHash: string
}

interface MintedNFT {
  tokenId: string
  contractAddress: string
  recipientAddress: string
  tokenURI: string
  mintedAt: string
  transactionHash: string
}

export function Dashboard() {
  const { isConnected, account } = useWallet()
  const [stats, setStats] = useState<DashboardStats>({
    videosGenerated: 0,
    contractsDeployed: 0,
    nftsMinted: 0,
    totalGasSpent: "0",
  })
  const [collections, setCollections] = useState<NFTCollection[]>([])
  const [mintedNFTs, setMintedNFTs] = useState<MintedNFT[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected && account) {
      fetchDashboardData()
    }
  }, [isConnected, account])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      const [statsRes, collectionsRes, nftsRes] = await Promise.all([
        fetch(`/api/dashboard?address=${account}`),
        fetch(`/api/nft-collections?address=${account}`),
        fetch(`/api/minted-nfts?address=${account}`),
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (collectionsRes.ok) {
        const collectionsData = await collectionsRes.json()
        setCollections(collectionsData.collections || [])
      }

      if (nftsRes.ok) {
        const nftsData = await nftsRes.json()
        setMintedNFTs(nftsData.nfts || [])
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const openExplorer = (txHash: string) => {
    window.open(`https://explorer.fuse.io/tx/${txHash}`, "_blank")
  }

  if (!isConnected) {
    return (
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <p className="text-slate-300">Please connect your wallet to view dashboard</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Videos Generated</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.videosGenerated}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-400/30" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Contracts Deployed</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.contractsDeployed}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-400/30" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">NFTs Minted</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.nftsMinted}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-400/30" />
          </div>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm mb-2">Total Gas Spent</p>
              <p className="text-3xl font-bold text-cyan-400">{stats.totalGasSpent}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-cyan-400/30" />
          </div>
        </Card>
      </div>

      {/* Tabs for Collections and NFTs */}
      <Card className="bg-slate-800/50 border-slate-700 p-6">
        <Tabs defaultValue="collections" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-700/50 border border-slate-600">
            <TabsTrigger value="collections" className="data-[state=active]:bg-cyan-600">
              Collections ({collections.length})
            </TabsTrigger>
            <TabsTrigger value="minted" className="data-[state=active]:bg-cyan-600">
              Minted NFTs ({mintedNFTs.length})
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-cyan-600">
              Account
            </TabsTrigger>
          </TabsList>

          {/* Collections Tab */}
          <TabsContent value="collections" className="mt-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
            ) : collections.length > 0 ? (
              collections.map((collection) => (
                <div
                  key={collection.contractAddress}
                  className="bg-slate-900/50 border border-slate-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{collection.name}</h3>
                      <p className="text-sm text-slate-400">Symbol: {collection.symbol}</p>
                    </div>
                    <span className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded text-sm font-medium">
                      {collection.totalSupply} NFTs
                    </span>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Contract Address</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono text-xs">
                          {collection.contractAddress.slice(0, 6)}...{collection.contractAddress.slice(-4)}
                        </span>
                        <button
                          onClick={() =>
                            copyToClipboard(collection.contractAddress, `contract-${collection.contractAddress}`)
                          }
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Deployed</span>
                      <span className="text-slate-300">{new Date(collection.deployedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => openExplorer(collection.transactionHash)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on Explorer
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No collections deployed yet</p>
              </div>
            )}
          </TabsContent>

          {/* Minted NFTs Tab */}
          <TabsContent value="minted" className="mt-6 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader className="w-6 h-6 animate-spin text-cyan-400" />
              </div>
            ) : mintedNFTs.length > 0 ? (
              mintedNFTs.map((nft) => (
                <div key={nft.tokenId} className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Token #{nft.tokenId}</h3>
                      <p className="text-sm text-slate-400">Minted {new Date(nft.mintedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Contract</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono text-xs">
                          {nft.contractAddress.slice(0, 6)}...{nft.contractAddress.slice(-4)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(nft.contractAddress, `nft-contract-${nft.tokenId}`)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Recipient</span>
                      <div className="flex items-center gap-2">
                        <span className="text-cyan-400 font-mono text-xs">
                          {nft.recipientAddress.slice(0, 6)}...{nft.recipientAddress.slice(-4)}
                        </span>
                        <button
                          onClick={() => copyToClipboard(nft.recipientAddress, `recipient-${nft.tokenId}`)}
                          className="text-slate-400 hover:text-slate-200"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => openExplorer(nft.transactionHash)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white py-2 rounded text-sm transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View Transaction
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">No NFTs minted yet</p>
              </div>
            )}
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="mt-6">
            <div className="space-y-4">
              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-2">Connected Address</p>
                <div className="flex items-center justify-between">
                  <p className="text-cyan-400 font-mono break-all">{account}</p>
                  <button
                    onClick={() => copyToClipboard(account || "", "account")}
                    className="text-slate-400 hover:text-slate-200 flex-shrink-0 ml-2"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                <p className="text-slate-400 text-sm mb-3">Quick Actions</p>
                <div className="space-y-2">
                  <Button
                    onClick={() => openExplorer("")}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white"
                  >
                    View on Fuse Explorer
                  </Button>
                  <Button onClick={fetchDashboardData} className="w-full bg-cyan-600 hover:bg-cyan-700">
                    Refresh Data
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
