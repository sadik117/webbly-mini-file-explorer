'use client';

import { useFileStore } from '@/store/useFileStore';
import TreeNode from './TreeNode';

export default function Sidebar() {
  // the full tree from zustand store
  const nodes = useFileStore((state) => state.nodes);

  return (
    <div className="w-64 h-screen border-r border-gray-200 bg-gray-50 flex flex-col overflow-y-auto">
      {/* sidebar header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">File Explorer</h2>
      </div>

      {/* tree view container */}
      <div className="p-2 flex-1 overflow-y-auto">
        {nodes.length === 0 ? (
          <p className="text-xs text-gray-500 italic p-2">Empty folder</p>
        ) : (
          // map through the root level nodes and render them
          // each TreeNode will handle rendering its own children recursively
          nodes.map((node) => <TreeNode key={node.id} node={node} />)
        )}
      </div>
    </div>
  );
}
