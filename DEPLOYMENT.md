# MemeForge Deployment Guide

## Overview
MemeForge is a Web3 application for creating video memes and minting them as NFTs on the Fuse network. This guide covers deployment to both Fuse Testnet and Mainnet.

## Prerequisites

1. **Node.js** - v18 or higher
2. **Vercel Account** - for hosting
3. **Wallet** - MetaMask, Rabby, or OKX wallet with FUSE tokens
4. **Environment Variables** - API keys for Sora video generation

## Environment Variables

Create a `.env.local` file with the following variables:

\`\`\`env
# Sora API Configuration
COMET_API_KEY=your_comet_api_key_here

# Fuse Network RPC (optional, defaults are used if not provided)
NEXT_PUBLIC_FUSE_RPC_URL=https://rpc.fuse.io
NEXT_PUBLIC_FUSE_TESTNET_RPC_URL=https://rpc.fusespark.io

# Optional: Vercel Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=your_analytics_id
\`\`\`

## Local Development

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Run Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Access Application**
   - Open http://localhost:3000 in your browser
   - Connect your wallet (MetaMask, Rabby, or OKX)
   - Switch to Fuse Testnet (Chain ID: 123) for testing

## Fuse Network Configuration

### Fuse Mainnet
- **Chain ID**: 122
- **RPC URL**: https://rpc.fuse.io
- **Currency**: FUSE
- **Explorer**: https://explorer.fuse.io

### Fuse Testnet (Spark)
- **Chain ID**: 123
- **RPC URL**: https://rpc.fusespark.io
- **Currency**: SPARK
- **Explorer**: https://explorer.fusespark.io
- **Faucet**: https://faucet.fusespark.io

## Testing on Fuse Testnet

### Step 1: Get Test Tokens
1. Visit https://faucet.fusespark.io
2. Enter your wallet address
3. Request SPARK tokens (test FUSE)

### Step 2: Test Video Generation
1. Navigate to the "Generate" tab
2. Enter a meme prompt (e.g., "A cat dancing to electronic music")
3. Set duration (1-60 seconds)
4. Click "Generate Video"
5. Wait for video generation (may take 30-60 seconds)

### Step 3: Deploy Test Contract
1. Go to the "Deploy" tab
2. Enter contract details:
   - Contract Name: "TestMemeNFT"
   - Symbol: "TMEME"
   - Base URI: (optional) https://ipfs.io/ipfs/your_metadata_hash
3. Click "Estimate Gas" to see costs
4. Click "Deploy Contract"
5. Confirm transaction in your wallet
6. Wait for confirmation (usually 5-10 seconds on Testnet)

### Step 4: Mint Test NFT
1. Go to the "Mint NFT" tab
2. Enter:
   - Contract Address: (from deployment)
   - Recipient Address: Your wallet address
   - Token URI: https://ipfs.io/ipfs/your_metadata_hash
3. Click "Estimate Gas"
4. Click "Mint NFT"
5. Confirm transaction in your wallet

### Step 5: View Dashboard
1. Go to the "Dashboard" tab
2. View your deployed contracts and minted NFTs
3. Click "View on Explorer" to see transactions on Fuse Explorer

## Deployment to Vercel

### Step 1: Push to GitHub
\`\`\`bash
git add .
git commit -m "Ready for deployment"
git push origin main
\`\`\`

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Select the project

### Step 3: Configure Environment Variables
1. In Vercel project settings, go to "Environment Variables"
2. Add the following variables:
   - `COMET_API_KEY`: Your Sora API key
   - `NEXT_PUBLIC_FUSE_RPC_URL`: https://rpc.fuse.io
   - `NEXT_PUBLIC_FUSE_TESTNET_RPC_URL`: https://rpc.fusespark.io

### Step 4: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at `your-project.vercel.app`

## Production Deployment (Mainnet)

### Important: Before Going Live
1. Test thoroughly on Testnet first
2. Ensure all environment variables are correct
3. Have sufficient FUSE tokens for gas fees
4. Review contract code for security

### Mainnet Deployment Steps
1. Update wallet to use Fuse Mainnet (Chain ID: 122)
2. Ensure you have FUSE tokens for gas fees
3. Deploy contracts on Mainnet
4. Verify contracts on Fuse Explorer

### Gas Fees on Mainnet
- Contract Deployment: ~2.5M gas (~0.5-1 FUSE)
- NFT Minting: ~150K gas (~0.03-0.05 FUSE)
- Video Generation: No gas cost (off-chain)

## Monitoring & Troubleshooting

### Common Issues

**Wallet Connection Failed**
- Ensure MetaMask/Rabby/OKX is installed
- Check that you're on the correct network
- Try refreshing the page

**Transaction Failed**
- Check gas price and balance
- Ensure contract address is correct
- Verify network connection

**Video Generation Timeout**
- Check API key configuration
- Verify internet connection
- Try with shorter duration

### Monitoring
- Use Fuse Explorer to track transactions: https://explorer.fuse.io
- Monitor gas prices and adjust accordingly
- Check API usage in Comet dashboard

## Support & Resources

- **Fuse Documentation**: https://docs.fuse.io
- **Fuse Discord**: https://discord.gg/fusenetwork
- **Vercel Documentation**: https://vercel.com/docs
- **Sora API Documentation**: https://platform.openai.com/docs/guides/vision

## Security Considerations

1. **Never share private keys** - Always use wallet extensions
2. **Verify contract addresses** - Double-check before transactions
3. **Test on Testnet first** - Always test before Mainnet deployment
4. **Monitor gas prices** - Set appropriate gas limits
5. **Keep API keys secure** - Use environment variables, never commit keys

## Rollback Procedure

If issues occur after deployment:
1. Revert to previous commit: `git revert HEAD`
2. Push to GitHub
3. Vercel will automatically redeploy previous version
4. Investigate issue and fix
5. Deploy corrected version
