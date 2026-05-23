'use client';

import { useFileStore } from '@/store/useFileStore';
import { getChildren, findNode } from '@/utils/treeHelpers';
import FileItem from './FileItem';
import { Home, ChevronRight } from 'lucide-react';

export default function MainPanel() {

  const nodes = useFileStore((state) => state.nodes);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const selectFolder = useFileStore((state) => state.selectFolder);

  const items = getChildren(nodes, selectedFolderId);

  const selectedFolder = selectedFolderId ? findNode(nodes, selectedFolderId) : null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="h-13 border-b border-gray-200 bg-white flex items-center gap-1 px-4 shrink-0">

        {/* Home */}
        <button
          onClick={() => selectFolder(null)}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          <Home size={14} />
          <span>Home</span>
        </button>

        {/* only show folder name breadcrumb if inside a folder */}
        {selectedFolder && (
          <>
            <ChevronRight size={14} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-800">{selectedFolder.name}</span>
          </>
        )}
      </div>

      {/* CONTENT GRID */}
      <div className="flex-1 overflow-y-auto p-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
            <p className="text-sm">This folder is empty.</p>
          </div>
        ) : (
          <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))' }}>
            {items.map((node) => (
              <FileItem key={node.id} node={node} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
