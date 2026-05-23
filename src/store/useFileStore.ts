// ─────────────────────────────────────────────────────────────
// FILE: src/store/useFileStore.ts
//
// PURPOSE: The single source of truth for ALL application state.
//          Every component reads from here and writes to here.
//          Nothing is stored anywhere else (no useState for data).
//
// WHAT IS ZUSTAND?
//   Zustand is a small, fast state-management library for React.
//   Unlike Redux, there is no boilerplate — just a `create()` call.
//   Components subscribe to only the slice of state they need,
//   so they re-render ONLY when that specific piece changes.
//
// PATTERN: create()(set, get) => ({ state, actions })
//   - `set` is a function to UPDATE state (always immutable)
//   - `get` is a function to READ current state inside actions
//   - The object returned is the store: state fields + action functions
// ─────────────────────────────────────────────────────────────

import { create } from 'zustand';
// `persist` is a Zustand middleware.
// Middleware wraps the store and adds extra behaviour.
// `persist` specifically: serializes state to JSON and saves it
// in localStorage every time state changes, then reloads it
// automatically on the next page visit.
import { persist } from 'zustand/middleware';

// Import our recursive pure helper functions from Step 1.
// These do the actual tree manipulation — the store just calls them.
import {
  addNode,
  deleteNode,
  renameNode,
  updateFileContent,
} from '@/utils/treeHelpers';

// Import the FileNode type for TypeScript type safety.
import { FileNode } from '@/types';

// Import the starting mock data. This is used ONLY on the very first
// load when localStorage is empty. After that, persist takes over.
import { mockData } from '@/data/mockData';

// Import UUID generator to create unique IDs for newly created nodes.
import { v4 as uuidv4 } from 'uuid';

// ─────────────────────────────────────────────────────────────
// STORE INTERFACE
//
// This interface describes the COMPLETE shape of our store:
// both the state fields (data) and the action functions (methods).
//
// Defining an interface separately (rather than inline) means:
// 1. TypeScript gives us full autocomplete on `useFileStore()`
// 2. We can see all available state and actions in one place
// ─────────────────────────────────────────────────────────────
interface FileStore {
  // ── STATE FIELDS ────────────────────────────────────────────

  // The entire file system tree, stored as a flat-ish root array.
  // Every FileNode can contain nested children — depth is unlimited.
  nodes: FileNode[];

  // The ID of the folder currently open in the Main Panel.
  // null means we're at the "root" level (showing all top-level nodes).
  // When a user clicks a folder, this ID changes and the Main Panel re-renders.
  selectedFolderId: string | null;

  // The ID of the text file currently open in the Editor panel.
  // null means no file is open (editor is hidden).
  openFileId: string | null;

  // ── ACTIONS (functions that change state) ───────────────────

  // Create a new folder or file inside the specified parent folder.
  // parentId: where to create it (null = root level)
  // name: display name
  // type: 'folder' or 'file'
  createNode: (parentId: string | null, name: string, type: 'folder' | 'file') => void;

  // Rename an existing node. Works for both folders and files.
  renameNode: (id: string, newName: string) => void;

  // Delete a node by ID. If it's a folder, all children are deleted too.
  deleteNode: (id: string) => void;

  // Save updated text content for a text file.
  // Called when the user clicks "Save" in the TextEditor.
  updateFileContent: (id: string, content: string) => void;

  // Set the currently selected folder (shown in the Main Panel).
  // Called when user clicks a folder in either sidebar or main panel.
  selectFolder: (id: string | null) => void;

  // Open a text file in the editor.
  // Called when user clicks a file in the Main Panel or Sidebar.
  openFile: (id: string) => void;

  // Close the editor (sets openFileId back to null).
  closeFile: () => void;
}

// ─────────────────────────────────────────────────────────────
// CREATE THE STORE
//
// `create<FileStore>()` — the generic tells TypeScript the shape.
//
// WHY TWO PAIRS OF ()() ?
//   create<FileStore>()  ← The outer call sets up TypeScript generics.
//   (persist(...))       ← The inner call receives the middleware.
//   This is how Zustand's typing system works with middleware.
//
// `persist(storeCreator, options)`:
//   Wraps our store creator. Every time `set()` is called,
//   persist serializes the new state to JSON and writes it
//   to localStorage under the key `name`.
//   On next page load, it reads from localStorage and restores state.
// ─────────────────────────────────────────────────────────────
export const useFileStore = create<FileStore>()(
  persist(
    // This is our actual store creator function.
    // Zustand calls it with `set` and `get` functions.
    (set, get) => ({
      // ── INITIAL STATE ────────────────────────────────────────

      // Start with our mock data (only used on first ever load).
      // After first load, `persist` overrides this with localStorage data.
      nodes: mockData,

      // No folder is selected initially → shows root level in Main Panel.
      selectedFolderId: null,

      // No file is open initially → editor is hidden.
      openFileId: null,

      // ── ACTION: createNode ───────────────────────────────────
      //
      // HOW IT WORKS:
      //  1. Build a new FileNode object with a fresh UUID.
      //  2. Call the pure `addNode()` helper with the current tree.
      //  3. `set()` replaces `nodes` with the new tree returned by addNode.
      //
      // `set()` is SHALLOW MERGE by default in Zustand:
      //   set({ nodes: newTree }) only updates `nodes`,
      //   leaving `selectedFolderId` and `openFileId` untouched.
      createNode: (parentId, name, type) => {
        // Build the new node object.
        // For folders: no content, children starts as empty array.
        // For files: no children, content starts as empty string.
        const newNode: FileNode = {
          id: uuidv4(),      // Fresh unique ID every time
          name,              // Shorthand property: name: name
          type,              // 'folder' or 'file'
          // Conditional properties based on type:
          ...(type === 'folder' ? { children: [] } : { content: '' }),
          // The spread `...{}` merges the conditional object into newNode.
          // If type is 'folder' → { children: [] } is merged in.
          // If type is 'file'   → { content: '' } is merged in.
        };

        // `get()` reads the CURRENT state inside an action.
        // We need the current tree to pass into `addNode()`.
        const currentNodes = get().nodes;

        // Call the pure helper — returns a brand new tree.
        const updatedNodes = addNode(currentNodes, parentId, newNode);

        // Update state with the new tree.
        // React will re-render any component that reads `nodes`.
        set({ nodes: updatedNodes });
      },

      // ── ACTION: renameNode ───────────────────────────────────
      //
      // Gets current tree → calls pure renameNode helper → sets new tree.
      // The helper walks the tree and returns a copy with the name changed.
      renameNode: (id, newName) => {
        const updatedNodes = renameNode(get().nodes, id, newName);
        set({ nodes: updatedNodes });
      },

      // ── ACTION: deleteNode ───────────────────────────────────
      //
      // Gets current tree → calls pure deleteNode helper → sets new tree.
      //
      // IMPORTANT SIDE EFFECT:
      //   If the deleted node is the currently open file or selected folder,
      //   we must also clear those IDs — otherwise the UI would still try
      //   to display a node that no longer exists in the tree.
      deleteNode: (id) => {
        const updatedNodes = deleteNode(get().nodes, id);

        // Build the state update object.
        const stateUpdate: Partial<FileStore> = { nodes: updatedNodes };

        // If the deleted node was the open file, close the editor.
        if (get().openFileId === id) {
          stateUpdate.openFileId = null;
        }

        // If the deleted node was the selected folder, go back to root.
        if (get().selectedFolderId === id) {
          stateUpdate.selectedFolderId = null;
        }

        // `set()` merges the stateUpdate object into current state.
        // This lets us update multiple fields in a single set() call,
        // which triggers only ONE re-render instead of three.
        set(stateUpdate as FileStore);
      },

      // ── ACTION: updateFileContent ────────────────────────────
      //
      // Called when the user saves edits in the TextEditor.
      // Walks the tree, finds the file by ID, updates its content.
      updateFileContent: (id, content) => {
        const updatedNodes = updateFileContent(get().nodes, id, content);
        set({ nodes: updatedNodes });
      },

      // ── ACTION: selectFolder ─────────────────────────────────
      //
      // Sets which folder is "open" in the Main Panel.
      // Also closes any open file — you can't view a folder AND edit a
      // file at the same time in our layout.
      selectFolder: (id) => {
        set({
          selectedFolderId: id,
          openFileId: null, // Close editor when navigating folders
        });
      },

      // ── ACTION: openFile ─────────────────────────────────────
      //
      // Sets which file is open in the TextEditor.
      // Simple: just update the ID.
      openFile: (id) => {
        set({ openFileId: id });
      },

      // ── ACTION: closeFile ────────────────────────────────────
      //
      // Closes the editor by clearing the open file ID.
      closeFile: () => {
        set({ openFileId: null });
      },
    }),

    // ── PERSIST OPTIONS ────────────────────────────────────────
    {
      // The key under which Zustand stores the serialized state
      // in localStorage. You can see it in DevTools → Application → Storage.
      name: 'mini-file-explorer-storage',

      // By default, `persist` saves ALL state fields to localStorage.
      // We can optionally use `partialize` to save only specific fields:
      // partialize: (state) => ({ nodes: state.nodes }),
      // This would exclude UI state (selectedFolderId, openFileId)
      // from being persisted — they reset on every page load.
      // For now we persist everything for a smoother user experience.
    }
  )
);
