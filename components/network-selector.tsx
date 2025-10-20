"use client"

import { useWallet } from "./wallet-provider"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"

const NETWORKS = {
  122: {
    name: "Fuse Mainnet",
    symbol: "FUSE",
    color: "bg-green-600",
    rpc: "https://rpc.fuse.io",
  },
  123: {
    name: "Fuse Testnet (Spark)",
    symbol: "SPARK",
    color: "bg-blue-600",
    rpc: "https://rpc.fusespark.io",
  },
}

export function NetworkSelector() {
  const { chainId, switchNetwork } = useWallet()

  const currentNetwork = NETWORKS[chainId as keyof typeof NETWORKS]

  return (
    <Card className="bg-slate-800/50 border-slate-700 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {currentNetwork ? (
            <>
              <div className={`w-3 h-3 rounded-full ${currentNetwork.color}`} />
              <div>
                <p className="text-sm font-medium text-white">{currentNetwork.name}</p>
                <p className="text-xs text-slate-400">{currentNetwork.symbol}</p>
              </div>
            </>
          ) : (
            <>
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <div>
                <p className="text-sm font-medium text-white">Unknown Network</p>
                <p className="text-xs text-slate-400">Please switch to Fuse</p>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => switchNetwork(123)}
            variant={chainId === 123 ? "default" : "outline"}
            size="sm"
            className={chainId === 123 ? "bg-blue-600 hover:bg-blue-700" : "bg-transparent border-slate-600"}
          >
            Testnet
          </Button>
          <Button
            onClick={() => switchNetwork(122)}
            variant={chainId === 122 ? "default" : "outline"}
            size="sm"
            className={chainId === 122 ? "bg-green-600 hover:bg-green-700" : "bg-transparent border-slate-600"}
          >
            Mainnet
          </Button>
        </div>
      </div>
    </Card>
  )
}
