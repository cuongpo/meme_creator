# 🎭 Meme Coin Creator

A decentralized application that allows users to create memes and turn popular ones into valuable coins on the Zora protocol. Built for the Zora Coinathon.

## 🎮 Live Demo

**Try it now:** [https://meme-creator-1.onrender.com](https://meme-creator-1.onrender.com)

Experience the full meme creation and coin generation workflow on Base Sepolia testnet!

## 🌟 Features

- **AI-Powered Meme Generation**: Create memes using popular templates with AI assistance
- **Popularity Tracking**: Track views, likes, shares, downloads, and comments
- **Coin Eligibility System**: Memes become eligible for coin creation based on engagement metrics
- **Zora Integration**: Create ERC20 tokens from popular memes using Zora's coins SDK
- **IPFS Storage**: Decentralized storage for meme images and metadata
- **Wallet Integration**: Connect with MetaMask, Coinbase Wallet, and WalletConnect
- **Viral Growth Simulation**: Demo feature to simulate viral meme growth

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- A Web3 wallet (MetaMask, Coinbase Wallet, etc.)
- Base network access (mainnet or testnet)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/meme_creator.git
   cd meme_creator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your configuration:
   - `REACT_APP_WALLETCONNECT_PROJECT_ID`: Get from [WalletConnect Cloud](https://cloud.walletconnect.com/)
   - `REACT_APP_PINATA_JWT`: Get from [Pinata](https://pinata.cloud/) for IPFS storage
   - `REACT_APP_OPENAI_API_KEY`: Optional, for AI meme generation

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Running the Backend

The application includes an Express backend for handling meme generation with OpenAI integration:

```bash
# Create a .env file in the root directory and add your OpenAI API key
echo "OPENAI_API_KEY=your-api-key-here" > .env

# Run both frontend and backend concurrently
npm run dev
```

This will start both the React frontend and the Express backend server.

## Project Structure

- `/public` - Static assets and HTML template
- `/src` - React application source code
  - `/api` - API client for meme generation
  - `/components` - React components
  - `/types` - TypeScript type definitions
  - `/utils` - Utility functions
- `/server` - Express backend for meme generation

## Technologies Used

- **Frontend**: React, TypeScript, Material-UI
- **Backend**: Node.js, Express
- **AI Integration**: OpenAI API (commented out in the demo version)

## Deployment to Render

This application can be easily deployed to Render using the provided configuration:

1. Create an account on [Render](https://render.com) if you don't have one already

2. Connect your GitHub repository to Render

3. Click on "New Web Service" and select your repository

4. Use the following settings:
   - Environment: Node
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

5. Add the following environment variables:
   - `NODE_ENV`: `production`
   - `OPENAI_API_KEY`: Your OpenAI API key

6. Click "Create Web Service"

Alternatively, you can use the `render.yaml` file included in the repository for automatic deployment:

1. Fork/clone this repository
2. Add it to Render as a Blueprint
3. Configure your environment variables
4. Deploy

## NFT Minting Integration

This application includes integration with the Sui blockchain for NFT minting:

- Custom Sui Move smart contract for NFT minting
- Backend implementation to interact with the Sui blockchain
- NFT metadata including name, description, image URL, and attributes
- Minting on Sui devnet with proper transaction details
- Server-paid gas fees, allowing users to mint NFTs for free

To use this feature, ensure your Sui CLI is properly configured and the correct Package ID and Minter Cap ID are set.

## Future Enhancements

- Enhanced AI-powered meme generation
- User accounts and saved memes
- More meme templates and categories
- Social sharing features
- Mobile app version
- Expanded NFT marketplace integration

## License

MIT
