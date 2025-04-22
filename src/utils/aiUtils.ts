import { MemeTemplate } from '../types/meme';

// Mock function to select a template based on prompt
// In a real application, this would use AI to analyze the prompt and select the most appropriate template
export const selectTemplate = (prompt: string, templates: MemeTemplate[]): MemeTemplate => {
  // Simple keyword matching for demonstration purposes
  const promptLower = prompt.toLowerCase();
  
  // Try to find a template that matches keywords in the prompt
  const keywordMap: Record<string, string[]> = {
    'success': ['success-kid'],
    'win': ['success-kid'],
    'works': ['success-kid'],
    'choose': ['two-buttons', 'drake'],
    'decision': ['two-buttons'],
    'opinion': ['change-my-mind'],
    'think': ['change-my-mind'],
    'wait': ['waiting-skeleton'],
    'surprise': ['surprised-pikachu'],
    'unexpected': ['surprised-pikachu'],
    'distracted': ['distracted-boyfriend'],
    'better': ['drake', 'distracted-boyfriend'],
    'versus': ['drake'],
    'vs': ['drake'],
    'fine': ['this-is-fine'],
    'stress': ['this-is-fine'],
    'problem': ['this-is-fine'],
    'simple': ['one-does-not-simply'],
    'impossible': ['one-does-not-simply'],
    'smart': ['expanding-brain'],
    'intelligence': ['expanding-brain'],
    'levels': ['expanding-brain']
  };
  
  // Check for keyword matches
  for (const [keyword, templateIds] of Object.entries(keywordMap)) {
    if (promptLower.includes(keyword)) {
      const matchedTemplate = templates.find(t => templateIds.includes(t.id));
      if (matchedTemplate) return matchedTemplate;
    }
  }
  
  // If no keyword matches, select a random template that fits the sentiment
  // For simplicity, we'll just pick a random template for now
  return templates[Math.floor(Math.random() * templates.length)];
};

// Mock function to generate meme text based on prompt
// In a real application, this would use AI to generate appropriate text for the meme
export const generateMemeText = (
  prompt: string, 
  template: MemeTemplate, 
  language: string
): { topText?: string; bottomText?: string } => {
  // For demonstration purposes, we'll use simple rules to split the prompt
  const hasTopPosition = !!template.textPositions.top;
  const hasBottomPosition = !!template.textPositions.bottom;
  
  // Different templates have different text placement requirements
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
      
    case 'surprised-pikachu':
      return {
        topText: prompt,
        bottomText: ""
      };
      
    case 'change-my-mind':
      return {
        bottomText: prompt
      };
      
    default:
      // For other templates, split the prompt if we have both top and bottom positions
      if (hasTopPosition && hasBottomPosition) {
        const words = prompt.split(' ');
        const midpoint = Math.ceil(words.length / 2);
        
        return {
          topText: words.slice(0, midpoint).join(' '),
          bottomText: words.slice(midpoint).join(' ')
        };
      } else if (hasTopPosition) {
        return { topText: prompt };
      } else if (hasBottomPosition) {
        return { bottomText: prompt };
      } else {
        return {}; // Should never happen with our templates
      }
  }
};

// In a real application, this would call an API like OpenAI to analyze the prompt
export const analyzePrompt = async (prompt: string) => {
  // Mock implementation
  return {
    sentiment: prompt.includes('happy') || prompt.includes('success') ? 'positive' : 'neutral',
    category: prompt.includes('code') ? 'Programming' : 'Life',
    intensity: Math.random() > 0.5 ? 'high' : 'medium'
  };
};
