'use client';

import { useState } from 'react';
import { useFileStore } from '@/store/useFileStore';
import { getChildren, findNode } from '@/utils/treeHelpers';
import FileItem from './FileItem';
import Modal from '@/components/shared/Modal';
import { Home, ChevronRight, Plus } from 'lucide-react';

export default function MainPanel() {
  const nodes = useFileStore((state) => state.nodes);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const selectFolder = useFileStore((state) => state.selectFolder);
  const createNode = useFileStore((state) => state.createNode);

  // derived values computed from store state
  const items = getChildren(nodes, selectedFolderId);
  const selectedFolder = selectedFolderId ? findNode(nodes, selectedFolderId) : null;

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreate = (name: string, type: 'folder' | 'file') => {
    createNode(selectedFolderId, name, type);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* header */}
      <div className="h-12 border-b border-gray-200 bg-white flex items-center justify-between px-4 shrink-0">

        <div className="flex items-center gap-1">
          <button
            onClick={() => selectFolder(null)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
          >
            <Home size={14} />
            <span>Home</span>
          </button>

          {/* only show folder name if inside a folder */}
          {selectedFolder && (
            <>
              <ChevronRight size={14} className="text-gray-400" />
              <span className="text-sm font-medium text-gray-800">{selectedFolder.name}</span>
            </>
          )}
        </div>

        {/* button to open create modal */}
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
            bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus size={13} />
          New
        </button>
      </div>


      {/* content grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-sm">This folder is empty.</p>
            <p className="text-xs">Click &quot;New&quot; to create a file or folder.</p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
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
        showTypeSelector={true} // show folder or file radio buttons
      />
    </div>
  );
}
