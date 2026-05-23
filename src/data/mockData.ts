import { FileNode } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export const mockData: FileNode[] = [

  {
    id: uuidv4(),
    name: 'Documents',
    type: 'folder',
    children: [

      {
        id: uuidv4(),
        name: 'Resume.txt',
        type: 'file',
        content: 'Sadik Sourov\nSoftware Engineer\n\nExperience:\n- 2+ years React development\n- TypeScript enthusiast',
      },

      {
        id: uuidv4(),
        name: 'Projects',
        type: 'folder',
        children: [

          {
            id: uuidv4(),
            name: 'Project_Ideas.txt',
            type: 'file',
            content: '1. Mini File Explorer\n2. Habit Tracker\n3. Budget Calculator',
          },
        ],
      },
    ],
  },

  {
    id: uuidv4(),
    name: 'Downloads',
    type: 'folder',
    children: [
      {
        id: uuidv4(),
        name: 'movie_notes.txt',
        type: 'file',
        content: 'Must watch:\n- Inception\n- The Matrix\n- Interstellar',
      },
    ],
  },

  {
    id: uuidv4(),
    name: 'TODO.txt',
    type: 'file',
    content: '- Buy groceries\n- Finish coding task\n- Review pull requests',
  },
];
