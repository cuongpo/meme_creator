# Text-to-Meme Generator

A web-based AI-powered application that allows users to input a text prompt and receive multiple relevant meme images with text overlay. The application uses OpenAI to intelligently select meme templates and generate appropriate text.

## Features

- **Text Prompt Input**: Enter a short sentence, idea, or quote (e.g., "When your code works on the first try")
- **Category Selection**: Optionally select a meme category (Programming, Marketing, etc.)
- **Language Selection**: Choose the language for your meme text
- **Multiple Meme Generation**: Generate 8 unique memes at once in a 2-column layout
- **AI-Powered Meme Generation**: Uses OpenAI to understand the context, select matching templates, and generate appropriate text
- **High-Resolution Meme Templates**: Curated collection of popular high-resolution meme templates
- **Image Rendering**: Dynamic generation of memes with text overlay
- **Interactive UI**: Download, edit, copy, and star your favorite memes

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/text-to-meme-generator.git
cd text-to-meme-generator
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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
