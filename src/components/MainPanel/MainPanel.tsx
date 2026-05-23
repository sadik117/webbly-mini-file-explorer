'use client';

import { useState } from 'react';
import { useFileStore } from '@/store/useFileStore';
import { getChildren, findNode } from '@/utils/treeHelpers';
import FileItem from './FileItem';
import Modal from '@/components/shared/Modal';
import { Home, ChevronRight, Plus, FolderOpen } from 'lucide-react';

export default function MainPanel() {
  const nodes = useFileStore((state) => state.nodes);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const selectFolder = useFileStore((state) => state.selectFolder);
  const createNode = useFileStore((state) => state.createNode);

  const items = getChildren(nodes, selectedFolderId);
  const selectedFolder = selectedFolderId ? findNode(nodes, selectedFolderId) : null;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (name: string, type: 'folder' | 'file') => {
    createNode(selectedFolderId, name, type);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-zinc-950 transition-colors duration-300">

      {/* header */}
      <div className="h-14 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md flex items-center justify-between px-4 sm:px-6 shrink-0">

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => selectFolder(null)}
            className="flex items-center gap-1.5 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Home size={16} />
            <span className="hidden sm:inline">Home</span>
          </button>

          {selectedFolder && (
            <>
              <ChevronRight size={16} className="text-zinc-400 dark:text-zinc-600" />
              <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px] sm:max-w-xs">{selectedFolder.name}</span>
            </>
          )}
        </div>

        {/* button to open create modal */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide
            bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm hover:shadow-blue-500/25 transition-all"
        >
          <Plus size={14} />
          New
        </button>
      </div>

      {/* content grid */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-zinc-400 dark:text-zinc-600 gap-3">
            <FolderOpen size={48} strokeWidth={1} className="opacity-50" />
            <div className="text-center">
              <p className="text-sm font-medium">This folder is empty</p>
              <p className="text-xs mt-1">Click &quot;New&quot; to create a file or folder.</p>
            </div>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8">
            {items.map((node) => (
              <FileItem key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>

      {/* create modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New"
        onConfirm={handleCreate}
        showTypeSelector={true}
      />
    </div>
  );
}
