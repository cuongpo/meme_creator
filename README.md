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

## Future Enhancements

- Integration with OpenAI or other AI services for more intelligent meme generation
- User accounts and saved memes
- More meme templates and categories
- Social sharing features
- Mobile app version

## License

MIT
