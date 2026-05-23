// ─────────────────────────────────────────────────────────────
// FILE: src/data/initialData.ts
//
// PURPOSE: Provide a hard-coded starting file tree so the app
//          has something to display on the very first load,
//          before the user has created anything.
//
//          When the Zustand store (Step 2) adds `persist`
//          middleware, this data is only used ONCE — on the
//          first ever visit. After that, localStorage takes over
//          and remembers whatever the user has changed.
// ─────────────────────────────────────────────────────────────

// Import our FileNode interface so TypeScript can validate
// that every object we write here matches the correct shape.
import { FileNode } from '@/types';

// Import the UUID v4 generator.
// v4 = "version 4" = randomly generated UUID.
// Example output: "110e8400-e29b-41d4-a716-446655440000"
// We alias it as `uuidv4` so the call site reads clearly.
import { v4 as uuidv4 } from 'uuid';

// initialData is an array of FileNode at the ROOT level.
// Think of it as the contents of the "Desktop" or "Home" folder.
// Folders inside this array can themselves contain more FileNodes.
//
// Why `FileNode[]` type annotation?
// It tells TypeScript: "this variable must be an array where
// every element satisfies the FileNode interface". If we make a
// typo — e.g. writing `typ` instead of `type` — TypeScript
// will show a red underline immediately.
export const initialData: FileNode[] = [
  // ── FOLDER: Documents ────────────────────────────────────
  {
    id: uuidv4(),     // Every node gets a unique random UUID at startup
    name: 'Documents',
    type: 'folder',
    children: [       // Folders have children; files do not

      // A text file directly inside Documents
      {
        id: uuidv4(),
        name: 'Resume.txt',
        type: 'file',
        // `content` is the actual text stored in this file.
        // The user can edit this in the TextEditor (Step 6).
        content: 'John Doe\nSoftware Engineer\n\nExperience:\n- 3 years React development\n- TypeScript enthusiast',
      },

      // ── NESTED FOLDER: Projects (inside Documents) ──────
      {
        id: uuidv4(),
        name: 'Projects',
        type: 'folder',
        children: [
          // A file nested 2 levels deep
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

  // ── FOLDER: Downloads ────────────────────────────────────
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

  // ── FILE: at root level (not inside any folder) ──────────
  // This demonstrates that files can exist at the root,
  // not just inside folders.
  {
    id: uuidv4(),
    name: 'TODO.txt',
    type: 'file',
    content: '- Buy groceries\n- Finish coding task\n- Review pull requests',
  },
];
