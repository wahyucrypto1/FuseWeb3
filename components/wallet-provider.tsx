"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Wallet, X } from "lucide-react"

interface WalletContextType {
  account: string | null
  chainId: number | null
  isConnected: boolean
  connect: (walletType: "metamask" | "rabby" | "okx") => Promise<void>
  disconnect: () => void
  switchNetwork: (chainId: number) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [chainId, setChainId] = useState<number | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" })
        const chainId = await window.ethereum.request({ method: "eth_chainId" })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setChainId(Number.parseInt(chainId, 16))
          setIsConnected(true)
        }
      } catch (error) {
        console.error("Error checking wallet:", error)
      }
    }
  }

  const connect = async (walletType: "metamask" | "rabby" | "okx") => {
    try {
      let provider = window.ethereum

      if (walletType === "rabby" && window.rabby) {
        provider = window.rabby
      } else if (walletType === "okx" && window.okxwallet) {
        provider = window.okxwallet
      }

      if (!provider) {
        alert(`Please install ${walletType} wallet`)
        return
      }

      const accounts = await provider.request({ method: "eth_requestAccounts" })
      const chainId = await provider.request({ method: "eth_chainId" })

      setAccount(accounts[0])
      setChainId(Number.parseInt(chainId, 16))
      setIsConnected(true)
      setShowWalletModal(false)

      // Listen for account changes
      provider.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
        } else {
          disconnect()
        }
      })

      // Listen for chain changes
      provider.on("chainChanged", (chainId: string) => {
        setChainId(Number.parseInt(chainId, 16))
      })
    } catch (error) {
      console.error("Error connecting wallet:", error)
      alert("Failed to connect wallet")
    }
  }

  const disconnect = () => {
    setAccount(null)
    setChainId(null)
    setIsConnected(false)
  }

  const switchNetwork = async (targetChainId: number) => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      })
    } catch (error: any) {
      if (error.code === 4902) {
        // Chain not added, add it
        await addFuseNetwork(targetChainId)
      }
    }
  }

  const addFuseNetwork = async (chainId: number) => {
    const networks: Record<number, any> = {
      122: {
        chainName: "Fuse Mainnet",
        rpcUrls: ["https://rpc.fuse.io"],
        nativeCurrency: { name: "Fuse", symbol: "FUSE", decimals: 18 },
        blockExplorerUrls: ["https://explorer.fuse.io"],
      },
      123: {
        chainName: "Fuse Testnet",
        rpcUrls: ["https://rpc.fusespark.io"],
        nativeCurrency: { name: "Spark", symbol: "SPARK", decimals: 18 },
        blockExplorerUrls: ["https://explorer.fusespark.io"],
      },
    }

    if (networks[chainId]) {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{ chainId: `0x${chainId.toString(16)}`, ...networks[chainId] }],
      })
    }
  }

  return (
    <WalletContext.Provider value={{ account, chainId, isConnected, connect, disconnect, switchNetwork }}>
      {children}
      {!isConnected && (
        <div className="fixed bottom-4 right-4 z-40 animate-slide-in-right">
          <Button
            onClick={() => setShowWalletModal(true)}
            className="bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 transform hover:scale-110 rounded-full"
          >
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        </div>
      )}
      {showWalletModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-fade-in-up">
          <Card className="bg-card border-border/50 backdrop-blur-xl p-6 max-w-sm w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Connect Wallet</h2>
              <button
                onClick={() => setShowWalletModal(false)}
                className="p-1 hover:bg-accent/20 rounded-lg transition-colors duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <Button
                onClick={() => connect("metamask")}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:shadow-lg hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105"
              >
                MetaMask
              </Button>
              <Button
                onClick={() => connect("rabby")}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:shadow-lg hover:shadow-purple-600/50 transition-all duration-300 transform hover:scale-105"
              >
                Rabby Wallet
              </Button>
              <Button
                onClick={() => connect("okx")}
                className="w-full bg-gradient-to-r from-black to-slate-800 hover:shadow-lg hover:shadow-slate-600/50 border border-border/50 transition-all duration-300 transform hover:scale-105"
              >
                OKX Wallet
              </Button>
              <Button
                onClick={() => setShowWalletModal(false)}
                variant="outline"
                className="w-full transition-all duration-300 hover:bg-accent/10"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider")
  }
  return context
}

declare global {
  interface Window {
    ethereum?: any
    rabby?: any
    okxwallet?: any
  }
}
