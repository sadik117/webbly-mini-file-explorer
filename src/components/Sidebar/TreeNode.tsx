'use client';

import { useState } from 'react';
import { FileNode } from '@/types';
import { useFileStore } from '@/store/useFileStore';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText } from 'lucide-react';

interface TreeNodeProps {
  node: FileNode;
  level?: number;
}

export default function TreeNode({ node, level = 0 }: TreeNodeProps) {
  // Local state for UI: track if this folder is expanded in the sidebar.
  // This is UI state, NOT data state, so it lives in the component, not Zustand.
  const [isOpen, setIsOpen] = useState(false);
  
  // Connect to our global Zustand store to read/write state
  const selectFolder = useFileStore((state) => state.selectFolder);
  const openFile = useFileStore((state) => state.openFile);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const openFileId = useFileStore((state) => state.openFileId);

  const isFolder = node.type === 'folder';
  
  // Highlight if this is the currently active folder or file
  const isSelected = isFolder ? selectedFolderId === node.id : openFileId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent clicking from triggering parent folder clicks
    
    if (isFolder) {
      // Toggle expand/collapse when clicking the folder
      setIsOpen((prev) => !prev);
      // Also set it as the currently selected folder in the main panel
      selectFolder(node.id);
    } else {
      // If it's a file, open it in the editor
      openFile(node.id);
    }
  };

  return (
    <div className="select-none">
      {/* Node Row */}
      <div
        onClick={handleClick}
        className={`flex items-center py-1 px-2 cursor-pointer hover:bg-gray-100 rounded-md text-sm transition-colors
          ${isSelected ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }} // Dynamic indentation based on recursion depth
      >
        {/* Chevron icon for folders only */}
        <div className="w-4 h-4 mr-1 flex items-center justify-center">
          {isFolder && (
            isOpen ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />
          )}
        </div>
        
        {/* File/Folder Type Icon */}
        <div className="mr-2">
          {isFolder ? (
            isOpen ? <FolderOpen size={16} className={isSelected ? "text-blue-600" : "text-blue-500"} /> : <Folder size={16} className={isSelected ? "text-blue-600" : "text-blue-500"} />
          ) : (
            <FileText size={16} className={isSelected ? "text-blue-600" : "text-gray-400"} />
          )}
        </div>
        
        {/* Node Name */}
        <span className="truncate">{node.name}</span>
      </div>

      {/* RECURSIVE STEP: Render children if this folder is open */}
      {isFolder && isOpen && node.children && (
        <div className="flex flex-col">
          {/* Map through each child and render another TreeNode component. 
              Increment the level so indentation increases. */}
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
