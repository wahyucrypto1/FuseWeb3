/**
 * Testing utilities for MemeForge
 * Use these functions to test the application on Testnet
 */

export const TEST_ACCOUNTS = {
  deployer: "0x1234567890123456789012345678901234567890",
  recipient: "0x0987654321098765432109876543210987654321",
}

export const TEST_CONTRACTS = {
  erc721: "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd",
}

export const TEST_METADATA = {
  name: "Test Meme NFT",
  description: "A test NFT for MemeForge",
  image: "https://ipfs.io/ipfs/QmExample",
  attributes: [
    { trait_type: "Rarity", value: "Common" },
    { trait_type: "Type", value: "Meme" },
  ],
}

/**
 * Generate a mock transaction hash for testing
 */
export function generateMockTxHash(): string {
  return `0x${Math.random().toString(16).slice(2).padEnd(64, "0")}`
}

/**
 * Generate a mock contract address for testing
 */
export function generateMockContractAddress(): string {
  return `0x${Math.random().toString(16).slice(2).padEnd(40, "0")}`
}

/**
 * Validate Ethereum address format
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address)
}

/**
 * Validate transaction hash format
 */
export function isValidTxHash(hash: string): boolean {
  return /^0x[a-fA-F0-9]{64}$/.test(hash)
}

/**
 * Format address for display (shortened)
 */
export function formatAddress(address: string): string {
  if (!isValidAddress(address)) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

/**
 * Convert Wei to FUSE
 */
export function weiToFuse(wei: string): string {
  return (Number.parseInt(wei, 16) / 1e18).toFixed(6)
}

/**
 * Convert FUSE to Wei
 */
export function fuseToWei(fuse: number): string {
  return (fuse * 1e18).toString()
}

/**
 * Test checklist for deployment
 */
export const DEPLOYMENT_CHECKLIST = [
  "Environment variables configured",
  "Wallet connected to correct network",
  "Sufficient gas balance (>0.1 FUSE)",
  "API keys validated",
  "Contract code reviewed",
  "Test transaction successful",
  "Dashboard data loading correctly",
  "Explorer links working",
]

/**
 * Network configuration for testing
 */
export const NETWORK_CONFIG = {
  testnet: {
    chainId: 123,
    name: "Fuse Testnet",
    rpc: "https://rpc.fusespark.io",
    explorer: "https://explorer.fusespark.io",
    faucet: "https://faucet.fusespark.io",
  },
  mainnet: {
    chainId: 122,
    name: "Fuse Mainnet",
    rpc: "https://rpc.fuse.io",
    explorer: "https://explorer.fuse.io",
    faucet: null,
  },
}
