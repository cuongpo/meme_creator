import { MemeTemplate } from '../types/meme';

// This is a mock database of meme templates
// In a real application, this would come from a database or API
const memeTemplates: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Hotline Bling',
    url: 'https://i.imgflip.com/30b1gx.jpg',
    categories: ['Reactions', 'Comparisons', 'Programming', 'Marketing', 'Life'],
    textPositions: {
      top: {
        x: 350,
        y: 100,
        maxWidth: 300
      },
      bottom: {
        x: 350,
        y: 300,
        maxWidth: 300
      }
    }
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    url: 'https://i.imgflip.com/1ur9b0.jpg',
    categories: ['Relationships', 'Comparisons', 'Programming', 'Marketing'],
    textPositions: {
      top: {
        x: 200,
        y: 50,
        maxWidth: 400
      },
      bottom: {
        x: 200,
        y: 350,
        maxWidth: 400
      }
    }
  },
  {
    id: 'success-kid',
    name: 'Success Kid',
    url: 'https://i.imgflip.com/1bhk.jpg',
    categories: ['Success', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: {
        x: 200,
        y: 50,
        maxWidth: 400
      },
      bottom: {
        x: 200,
        y: 350,
        maxWidth: 400
      }
    }
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    url: 'https://i.imgflip.com/1g8my4.jpg',
    categories: ['Decisions', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: {
        x: 200,
        y: 100,
        maxWidth: 300
      },
      bottom: {
        x: 200,
        y: 250,
        maxWidth: 300
      }
    }
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    url: 'https://i.imgflip.com/24y43o.jpg',
    categories: ['Opinions', 'Programming', 'Work', 'Social Media'],
    textPositions: {
      bottom: {
        x: 250,
        y: 250,
        maxWidth: 400
      }
    }
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain',
    url: 'https://i.imgflip.com/1jwhww.jpg',
    categories: ['Intelligence', 'Programming', 'Marketing', 'Life'],
    textPositions: {
      top: {
        x: 250,
        y: 100,
        maxWidth: 400
      },
      bottom: {
        x: 250,
        y: 400,
        maxWidth: 400
      }
    }
  },
  {
    id: 'one-does-not-simply',
    name: 'One Does Not Simply',
    url: 'https://i.imgflip.com/1bij.jpg',
    categories: ['Warnings', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: {
        x: 250,
        y: 50,
        maxWidth: 400
      },
      bottom: {
        x: 250,
        y: 300,
        maxWidth: 400
      }
    }
  },
  {
    id: 'surprised-pikachu',
    name: 'Surprised Pikachu',
    url: 'https://i.imgflip.com/2kbn1e.jpg',
    categories: ['Surprise', 'Reactions', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: {
        x: 250,
        y: 50,
        maxWidth: 400
      }
    }
  },
  {
    id: 'this-is-fine',
    name: 'This Is Fine',
    url: 'https://i.imgflip.com/26am.jpg',
    categories: ['Stress', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: {
        x: 250,
        y: 50,
        maxWidth: 400
      }
    }
  },
  {
    id: 'waiting-skeleton',
    name: 'Waiting Skeleton',
    url: 'https://i.imgflip.com/2fm6x.jpg',
    categories: ['Waiting', 'Programming', 'Work', 'Life'],
    textPositions: {
      top: {
        x: 250,
        y: 50,
        maxWidth: 400
      },
      bottom: {
        x: 250,
        y: 350,
        maxWidth: 400
      }
    }
  }
];

// Get all available meme templates
export const getMemeTemplates = (): MemeTemplate[] => {
  return memeTemplates;
};

// Get a template by ID
export const getTemplateById = (id: string): MemeTemplate | undefined => {
  return memeTemplates.find(template => template.id === id);
};

// Get templates by category
export const getTemplatesByCategory = (category: string): MemeTemplate[] => {
  return memeTemplates.filter(template => template.categories.includes(category));
};
