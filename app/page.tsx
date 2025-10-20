"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WalletProvider } from "@/components/wallet-provider"
import { VideoGenerator } from "@/components/video-generator"
import { ContractDeployer } from "@/components/contract-deployer"
import { ERC20Deployer } from "@/components/erc20-deployer"
import { NFTMinter } from "@/components/nft-minter"
import { Dashboard } from "@/components/dashboard"
import { NetworkSelector } from "@/components/network-selector"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sparkles, Zap, Coins, Palette, BarChart3 } from "lucide-react"
import { FuseLogo } from "@/components/fuse-logo"

export default function Home() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float"></div>
          <div
            className="absolute bottom-20 right-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-1/2 left-1/2 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-float"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Header */}
        <header className="border-b border-border/50 bg-background/80 dark:bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3 animate-fade-in-up">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-accent to-primary rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 animate-glow p-1">
                <FuseLogo className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  FuseBuilder
                </h1>
                <p className="text-xs text-muted-foreground">Web3 Creator Platform</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground hidden sm:block">Build • Deploy • Create</p>
              <ThemeToggle />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          <div className="mb-8 animate-slide-in-right">
            <NetworkSelector />
          </div>

          <Tabs defaultValue="generator" className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-card/50 border border-border/50 backdrop-blur-sm p-1 rounded-lg overflow-x-auto">
              <TabsTrigger
                value="generator"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Generate</span>
              </TabsTrigger>
              <TabsTrigger
                value="deploy-nft"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
              >
                <Zap className="w-4 h-4" />
                <span className="hidden sm:inline">NFT</span>
              </TabsTrigger>
              <TabsTrigger
                value="deploy-token"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
              >
                <Coins className="w-4 h-4" />
                <span className="hidden sm:inline">Token</span>
              </TabsTrigger>
              <TabsTrigger
                value="mint"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
              >
                <Palette className="w-4 h-4" />
                <span className="hidden sm:inline">Mint</span>
              </TabsTrigger>
              <TabsTrigger
                value="dashboard"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 flex items-center gap-2 text-xs sm:text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Dashboard</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="mt-6 animate-fade-in-up">
              <VideoGenerator />
            </TabsContent>

            <TabsContent value="deploy-nft" className="mt-6 animate-fade-in-up">
              <ContractDeployer />
            </TabsContent>

            <TabsContent value="deploy-token" className="mt-6 animate-fade-in-up">
              <ERC20Deployer />
            </TabsContent>

            <TabsContent value="mint" className="mt-6 animate-fade-in-up">
              <NFTMinter />
            </TabsContent>

            <TabsContent value="dashboard" className="mt-6 animate-fade-in-up">
              <Dashboard />
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-16 py-8 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
            <p>FuseBuilder - Build the future of Web3 on Fuse Network</p>
          </div>
        </footer>
      </div>
    </WalletProvider>
  )
}
