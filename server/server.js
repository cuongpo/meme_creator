const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { OpenAI } = require('openai');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Load environment variables
require('dotenv').config();

// Initialize OpenAI client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here' });

// IMPORTANT: Replace 'your-api-key-here' with your actual OpenAI API key
// For production, use environment variables instead of hardcoding the API key

// Meme templates database
const memeTemplates = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    url: 'https://i.imgflip.com/30b1gx.jpg',
    categories: ['Reactions', 'Comparisons', 'Programming', 'Marketing', 'Life'],
    textPositions: {
      top: { x: 350, y: 100, maxWidth: 300 },
      bottom: { x: 350, y: 300, maxWidth: 300 }
    }
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b.jpg',
    categories: ['Relationships', 'Comparisons', 'Programming', 'Marketing'],
    textPositions: {
      top: { x: 200, y: 50, maxWidth: 400 },
      bottom: { x: 200, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    url: 'https://i.imgflip.com/1bhk.jpg',
    categories: ['Success', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: { x: 200, y: 50, maxWidth: 400 },
      bottom: { x: 200, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg',
    categories: ['Decisions', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: { x: 200, y: 100, maxWidth: 300 },
      bottom: { x: 200, y: 250, maxWidth: 300 }
    }
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    url: 'https://i.imgflip.com/24y43o.jpg',
    categories: ['Opinions', 'Programming', 'Work', 'Social Media'],
    textPositions: {
      bottom: { x: 250, y: 250, maxWidth: 400 }
    }
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jwhww.jpg',
    categories: ['Intelligence', 'Programming', 'Marketing', 'Life'],
    textPositions: {
      top: { x: 250, y: 100, maxWidth: 400 },
      bottom: { x: 250, y: 400, maxWidth: 400 }
    }
  },
  {
    id: 'one-does-not-simply',
    name: 'One Does Not Simply',
    url: 'https://i.imgflip.com/1bij.jpg',
    categories: ['Warnings', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 300, maxWidth: 400 }
    }
  },
  {
    id: 'surprised-pikachu',
    name: 'Surprised Pikachu',
    url: 'https://i.imgflip.com/2kbn1e.jpg',
    categories: ['Surprise', 'Reactions', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 }
    }
  },
  {
    id: 'this-is-fine',
    name: 'This Is Fine',
    url: 'https://i.imgflip.com/2cp1.jpg',
    categories: ['Stress', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 }
    }
  },
  {
    id: 'waiting-skeleton',
    name: 'Waiting Skeleton',
    url: 'https://i.imgflip.com/2fm6x.jpg',
    categories: ['Waiting', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'guy-thinking',
    name: 'Guy Thinking',
    url: 'https://i.imgflip.com/1h7in3.jpg',
    categories: ['Thinking', 'Confusion', 'Programming', 'Work'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'woman-yelling',
    name: 'Woman Yelling at Cat',
    url: 'https://i.imgflip.com/38el31.jpg',
    categories: ['Arguments', 'Reactions', 'Social Media'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'disaster-girl',
    name: 'Disaster Girl',
    url: 'https://i.imgflip.com/23ls.jpg',
    categories: ['Evil', 'Chaos', 'Programming', 'Work'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'roll-safe',
    name: 'Roll Safe',
    url: 'https://i.imgflip.com/1h7in3.jpg',
    categories: ['Advice', 'Humor', 'Programming', 'Life'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'shut-up-and-take-my-money',
    name: 'Shut Up And Take My Money',
    url: 'https://i.imgflip.com/3si4.jpg',
    categories: ['Excitement', 'Products', 'Marketing'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'so-hot-right-now',
    name: 'So Hot Right Now',
    url: 'https://i.imgflip.com/cv1y0.jpg',
    categories: ['Trends', 'Programming', 'Marketing'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'matrix-morpheus',
    name: 'Matrix Morpheus',
    url: 'https://i.imgflip.com/25w3.jpg',
    categories: ['Advice', 'Reality', 'Programming'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'y-u-no',
    name: 'Y U No',
    url: 'https://i.imgflip.com/1bh3.jpg',
    categories: ['Questions', 'Frustration', 'Programming'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'hide-the-pain-harold',
    name: 'Hide the Pain Harold',
    url: 'https://i.imgflip.com/gk5el.jpg',
    categories: ['Awkward', 'Life', 'Work', 'Social Media'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'ancient-aliens',
    name: 'Ancient Aliens Guy',
    url: 'https://i.imgflip.com/26am.jpg',
    categories: ['Conspiracy', 'Programming', 'Work'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'doge',
    name: 'Doge',
    url: 'https://i.imgflip.com/4t0m5.jpg',
    categories: ['Animals', 'Funny', 'Social Media'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    },
  },
  {
    id: 'first-world-problems',
    name: 'First World Problems',
    url: 'https://i.imgflip.com/1bhf.jpg',
    categories: ['Complaints', 'Life', 'Social Media'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'galaxy-brain',
    name: 'Galaxy Brain',
    url: 'https://i.imgflip.com/24sx7.jpg',
    categories: ['Intelligence', 'Programming', 'Work'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'mocking-spongebob',
    name: 'Mocking Spongebob',
    url: 'https://i.imgflip.com/1otk96.jpg',
    categories: ['Mockery', 'Social Media', 'Arguments'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'change-my-mind-crowder',
    name: 'Change My Mind - Crowder',
    url: 'https://i.imgflip.com/24y43o.jpg',
    categories: ['Opinions', 'Debate', 'Social Media'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'they-dont-know',
    name: 'They Don\'t Know',
    url: 'https://i.imgflip.com/4pn1an.jpg',
    categories: ['Social Anxiety', 'Programming', 'Work'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'bad-luck-brian',
    name: 'Bad Luck Brian',
    url: 'https://i.imgflip.com/1bip.jpg',
    categories: ['Bad Luck', 'Failure', 'Life'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'finding-neverland',
    name: 'Finding Neverland',
    url: 'https://i.imgflip.com/3pnmg.jpg',
    categories: ['Realization', 'Emotional', 'Life'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'first-world-problems',
    name: 'First World Problems',
    url: 'https://i.imgflip.com/1bhf.jpg',
    categories: ['Complaints', 'Life', 'Humor'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'ancient-aliens',
    name: 'Ancient Aliens Guy',
    url: 'https://i.imgflip.com/26am.jpg',
    categories: ['Conspiracy', 'Humor', 'Explanation'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'futurama-fry',
    name: 'Futurama Fry',
    url: 'https://i.imgflip.com/1bgw.jpg',
    categories: ['Suspicion', 'Doubt', 'Confusion'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'x-all-the-y',
    name: 'X All The Y',
    url: 'https://i.imgflip.com/1bh9.jpg',
    categories: ['Motivation', 'Exaggeration', 'Programming'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'grandma-internet',
    name: 'Grandma Finds The Internet',
    url: 'https://i.imgflip.com/1bhw.jpg',
    categories: ['Technology', 'Confusion', 'Humor'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'third-world-skeptical',
    name: 'Third World Skeptical Kid',
    url: 'https://i.imgflip.com/265k.jpg',
    categories: ['Skepticism', 'Disbelief', 'Humor'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  },
  {
    id: 'steve-harvey',
    name: 'Steve Harvey Confused',
    url: 'https://i.imgflip.com/4bh6h.jpg',
    categories: ['Confusion', 'Reactions', 'Humor'],
    textPositions: {
      top: { x: 250, y: 50, maxWidth: 400 },
      bottom: { x: 250, y: 350, maxWidth: 400 }
    }
  }
];

// Track used templates to avoid duplicates
let usedTemplates = new Set();

// Reset used templates (call this when you want to start fresh)
const resetUsedTemplates = () => {
  usedTemplates.clear();
};

// Helper function to select template based on prompt using OpenAI
const selectTemplate = async (prompt, category) => {
  // Filter templates by category if provided
  let availableTemplates = [...memeTemplates];
  
  if (category && category !== 'All') {
    availableTemplates = memeTemplates.filter(template => 
      template.categories.includes(category)
    );
    
    // If no templates match the category, fall back to all templates
    if (availableTemplates.length === 0) {
      availableTemplates = [...memeTemplates];
    }
  }
  
  // Filter out already used templates if there are enough templates left
  const unusedTemplates = availableTemplates.filter(template => !usedTemplates.has(template.id));
  
  // Only use unused templates if we have enough left, otherwise reset and use all
  if (unusedTemplates.length > 0) {
    availableTemplates = unusedTemplates;
  } else if (usedTemplates.size >= memeTemplates.length / 2) {
    // If we've used more than half the templates, reset the tracking
    resetUsedTemplates();
  }
  
  try {
    // Use OpenAI to select the most appropriate template
    const templateOptions = availableTemplates.map(t => ({ id: t.id, name: t.name }));
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a meme selection assistant. Given a text prompt and a list of meme templates, select the most appropriate template ID for the prompt."
        },
        {
          role: "user",
          content: `Select the most appropriate meme template for this prompt: "${prompt}". Available templates: ${JSON.stringify(templateOptions)}. Respond with ONLY the template ID, nothing else.`
        }
      ],
      temperature: 0.7,
      max_tokens: 50
    });
    
    const selectedTemplateId = response.choices[0].message.content.trim();
    const selectedTemplate = availableTemplates.find(t => t.id === selectedTemplateId);
    
    // If OpenAI didn't return a valid template ID, fall back to random selection
    if (!selectedTemplate) {
      console.log(`OpenAI returned invalid template ID: ${selectedTemplateId}, falling back to random selection`);
      return availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
    }
    
    // Mark this template as used
    usedTemplates.add(selectedTemplate.id);
    
    return selectedTemplate;
  } catch (error) {
    console.error('Error using OpenAI for template selection:', error);
    // Fallback to simple keyword matching if OpenAI fails
    const promptLower = prompt.toLowerCase();
    const keywordMap = {
      'success': ['success-kid'],
      'win': ['success-kid'],
      'choose': ['drake'],
      'better': ['drake'],
      'relationship': ['distracted-boyfriend'],
      'distracted': ['distracted-boyfriend']
    };
    
    for (const [keyword, templateIds] of Object.entries(keywordMap)) {
      if (promptLower.includes(keyword)) {
        const matchedTemplate = availableTemplates.find(t => templateIds.includes(t.id));
        if (matchedTemplate) return matchedTemplate;
      }
    }
    
    // If no match, return random template
    return availableTemplates[Math.floor(Math.random() * availableTemplates.length)];
  }
};

// Helper function to generate meme text using OpenAI
const generateMemeText = async (prompt, template, language) => {
  try {
    // Use OpenAI to generate appropriate text for the meme
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a meme caption generator. Given a prompt and a meme template, generate appropriate text for the meme. The template is: ${template.name}.`
        },
        {
          role: "user",
          content: `Generate top and bottom text for a meme based on this prompt: "${prompt}". The meme template is: ${template.name}. Respond in JSON format with topText and bottomText properties. Keep each caption short and punchy - no more than 10 words each.`
        }
      ],
      temperature: 0.8,
      max_tokens: 100
    });
    
    try {
      // Parse the response to get the top and bottom text
      const responseText = response.choices[0].message.content.trim();
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsedResponse = JSON.parse(jsonMatch[0]);
        return {
          topText: parsedResponse.topText || "",
          bottomText: parsedResponse.bottomText || ""
        };
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
    }
    
    // Fallback to rule-based text generation if OpenAI fails or returns invalid format
    return fallbackTextGeneration(prompt, template);
  } catch (error) {
    console.error('Error using OpenAI for text generation:', error);
    // Fallback to rule-based text generation
    return fallbackTextGeneration(prompt, template);
  }
};

// Fallback text generation function
const fallbackTextGeneration = (prompt, template) => {
  switch (template.id) {
    case 'drake':
      return {
        topText: "The old way",
        bottomText: prompt
      };
      
    case 'distracted-boyfriend':
      const parts = prompt.split(' vs ');
      return {
        topText: parts.length > 1 ? parts[1] : "The new thing",
        bottomText: parts.length > 1 ? parts[0] : "What I should be focusing on"
      };
      
    case 'success-kid':
      return {
        topText: "",
        bottomText: prompt.toUpperCase()
      };
      
    default:
      // For other templates, split the prompt if we have both top and bottom positions
      if (template.textPositions.top && template.textPositions.bottom) {
        const words = prompt.split(' ');
        const midpoint = Math.ceil(words.length / 2);
        
        return {
          topText: words.slice(0, midpoint).join(' '),
          bottomText: words.slice(midpoint).join(' ')
        };
      } else if (template.textPositions.top) {
        return { topText: prompt };
      } else if (template.textPositions.bottom) {
        return { bottomText: prompt };
      } else {
        return {}; // Should never happen with our templates
      }
  }
};

// API endpoint to generate a meme
app.post('/api/generate-meme', async (req, res) => {
  try {
    const { prompt, category, language, resetTemplates, batchIndex } = req.body;
    
    // Reset used templates if this is the first meme in a batch
    if (resetTemplates) {
      resetUsedTemplates();
    }
    
    if (!prompt) {
      return res.status(400).json({ success: false, error: 'Prompt is required' });
    }
    
    // Select template based on prompt, category, and batch index
    let selectedTemplate;
    
    if (batchIndex !== undefined) {
      // For batch requests, use deterministic template selection
      // Filter templates by category if provided
      let availableTemplates = [...memeTemplates];
      
      if (category && category !== 'All') {
        const categoryTemplates = memeTemplates.filter(template => 
          template.categories.includes(category)
        );
        
        if (categoryTemplates.length > 0) {
          availableTemplates = categoryTemplates;
        }
      }
      
      // Filter out already used templates
      const unusedTemplates = availableTemplates.filter(template => !usedTemplates.has(template.id));
      
      if (unusedTemplates.length > 0) {
        // Select a template based on the batch index to ensure variety
        const templateIndex = batchIndex % unusedTemplates.length;
        selectedTemplate = unusedTemplates[templateIndex];
        usedTemplates.add(selectedTemplate.id);
      } else {
        // If all templates have been used, fall back to AI selection
        selectedTemplate = await selectTemplate(prompt, category);
      }
    } else {
      // For single requests, use AI-based selection
      selectedTemplate = await selectTemplate(prompt, category);
    }
    
    // Generate meme text using AI
    const { topText, bottomText } = await generateMemeText(prompt, selectedTemplate, language || 'en');
    
    // In a real app, this would generate an actual image
    // For now, we'll just return the template and text
    const result = {
      id: `meme-${Date.now()}`,
      templateId: selectedTemplate.id,
      templateName: selectedTemplate.name,
      imageUrl: selectedTemplate.url, // In production, this would be a generated image URL
      topText,
      bottomText,
      prompt
    };
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error('Error generating meme:', error);
    res.status(500).json({ success: false, error: 'Failed to generate meme' });
  }
});

// Get all meme templates
app.get('/api/templates', (req, res) => {
  res.json({ success: true, data: memeTemplates });
});

// Serve React app in production
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
