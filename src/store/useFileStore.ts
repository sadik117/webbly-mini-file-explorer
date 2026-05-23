import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FileNode } from '@/types';
import { mockData } from '@/data/mockData';
import { v4 as uuidv4 } from 'uuid';
import {
  addNode,
  deleteNode,
  renameNode,
  updateFileContent,
} from '@/utils/treeHelpers';


interface FileStore {

  nodes: FileNode[];
  selectedFolderId: string | null;
  openFileId: string | null;

  createNode: (parentId: string | null, name: string, type: 'folder' | 'file') => void;
  renameNode: (id: string, newName: string) => void;
  deleteNode: (id: string) => void;
  updateFileContent: (id: string, content: string) => void;
  selectFolder: (id: string | null) => void;
  openFile: (id: string) => void;
  closeFile: () => void;

}


export const useFileStore = create<FileStore>()(
  persist(
    (set, get) => ({
      nodes: mockData,
      selectedFolderId: null,
      openFileId: null,

      createNode: (parentId, name, type) => {
        const newNode: FileNode = {
          id: uuidv4(),
          name,
          type,
          ...(type === 'folder' ? { children: [] } : { content: '' }),
        };

        const currentNodes = get().nodes;
        const updatedNodes = addNode(currentNodes, parentId, newNode);

        set({ nodes: updatedNodes });
      },


      renameNode: (id, newName) => {
        const updatedNodes = renameNode(get().nodes, id, newName);
        set({ nodes: updatedNodes });
      },


      deleteNode: (id) => {
        // deleteNode helper
        const updatedNodes = deleteNode(get().nodes, id);
        const stateUpdate: Partial<FileStore> = { nodes: updatedNodes };

        if (get().openFileId === id) {
          stateUpdate.openFileId = null;
        }

        if (get().selectedFolderId === id) {
          stateUpdate.selectedFolderId = null;
        }

        set(stateUpdate as FileStore);
      },


      updateFileContent: (id, content) => {
        const updatedNodes = updateFileContent(get().nodes, id, content);
        set({ nodes: updatedNodes });
      },


      selectFolder: (id) => {
        set({
          selectedFolderId: id,
          openFileId: null,
        });
      },


      openFile: (id) => {
        set({ openFileId: id });
      },


      closeFile: () => {
        set({ openFileId: null });
      },
    }),

    // persist option
    {
      name: 'mini-file-explorer-storage',
    }
  )
);
