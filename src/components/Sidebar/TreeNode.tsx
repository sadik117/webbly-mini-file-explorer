'use client';

import { useState } from 'react';
import { FileNode } from '@/types';
import { useFileStore } from '@/store/useFileStore';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/shared/Modal';

interface TreeNodeProps {
  node: FileNode;
  level?: number;
}

export default function TreeNode({ node, level = 0 }: TreeNodeProps) {
  
  const [isOpen, setIsOpen] = useState(false);
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const selectFolder = useFileStore((state) => state.selectFolder);
  const openFile = useFileStore((state) => state.openFile);
  const renameNode = useFileStore((state) => state.renameNode);
  const deleteNode = useFileStore((state) => state.deleteNode);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const openFileId = useFileStore((state) => state.openFileId);

  const isFolder = node.type === 'folder';
  const isSelected = isFolder ? selectedFolderId === node.id : openFileId === node.id;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isFolder) {
      setIsOpen((prev) => !prev);
      selectFolder(node.id);
    } else {
      openFile(node.id);
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenameModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      `Delete "${node.name}"?${isFolder ? '\n\nThis will also delete all contents inside.' : ''}`
    );
    if (confirmed) {
      deleteNode(node.id);
    }
  };

  return (
    <>
      <div className="select-none">
        <div
          onClick={handleClick}
          className={`group flex items-center py-1.5 px-2 cursor-pointer rounded-lg text-sm transition-all duration-200 mt-0.5
            ${isSelected 
              ? 'bg-blue-100/60 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium' 
              : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50'}`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {/* chevron icon for folders only */}
          <div className="w-4 h-4 mr-1 flex items-center justify-center">
            {isFolder && (
              isOpen ? <ChevronDown size={14} className="text-zinc-400" /> : <ChevronRight size={14} className="text-zinc-400" />
            )}
          </div>

          {/* file or folder type icon */}
          <div className="mr-2 transition-transform duration-200 group-hover:scale-110">
            {isFolder ? (
              isOpen ? <FolderOpen size={16} className={isSelected ? "text-blue-600 dark:text-blue-400" : "text-blue-500"} /> : <Folder size={16} className={isSelected ? "text-blue-600 dark:text-blue-400" : "text-blue-500"} />
            ) : (
              <FileText size={16} className={isSelected ? "text-blue-600 dark:text-blue-400" : "text-zinc-400 dark:text-zinc-500"} />
            )}
          </div>

          <span className="truncate flex-1">{node.name}</span>

          <div className="hidden group-hover:flex items-center gap-0.5 ml-1">
            <button
              onClick={handleRenameClick}
              title="Rename"
              className="p-1 rounded-md text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
            >
              <Pencil size={12} />
            </button>
            <button
              onClick={handleDelete}
              title="Delete"
              className="p-1 rounded-md text-zinc-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            >
              <Trash2 size={12} />
            </button>
          </div>
        </div>

        {/* recursive children */}
        {isFolder && isOpen && node.children && (
          <div className="flex flex-col">
            {node.children.map((child) => (
              <TreeNode key={child.id} node={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title={`Rename "${node.name}"`}
        onConfirm={(newName) => renameNode(node.id, newName)}
        initialName={node.name}
        showTypeSelector={false}
      />
    </>
  );
}
