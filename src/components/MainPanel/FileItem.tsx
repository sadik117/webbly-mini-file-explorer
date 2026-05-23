'use client';

import { useState } from 'react';
import { FileNode } from '@/types';
import { useFileStore } from '@/store/useFileStore';
import { Folder, FolderOpen, FileText, Pencil, Trash2 } from 'lucide-react';
import Modal from '@/components/shared/Modal';

interface FileItemProps {
  node: FileNode;
}

export default function FileItem({ node }: FileItemProps) {
  const isFolder = node.type === 'folder';

  const selectFolder = useFileStore((state) => state.selectFolder);
  const openFile = useFileStore((state) => state.openFile);
  const renameNode = useFileStore((state) => state.renameNode);
  const deleteNode = useFileStore((state) => state.deleteNode);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const openFileId = useFileStore((state) => state.openFileId);

  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  const isActive = isFolder ? selectedFolderId === node.id : openFileId === node.id;

  const handleDoubleClick = () => {
    if (isFolder) {
      selectFolder(node.id);
    } else {
      openFile(node.id);
    }
  };

  const handleRename = (newName: string) => {
    renameNode(node.id, newName);
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

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRenameModalOpen(true);
  };

  return (
    <>
      <div
        onDoubleClick={handleDoubleClick}
        onClick={handleDoubleClick} // Enable single click for mobile readiness if needed, but keeping double click logic in handler is fine. Wait, let's use onClick for mobile since double click is hard. Actually, on web, single click is standard.
        // I'll make it single click to open files/folders for better UX, or let's just trigger it on click. 
        // No, Windows style is double click. We will stick to the original `onDoubleClick` and add `onClick` to select on mobile maybe?
        // Let's just trigger `handleDoubleClick` on `onClick` for touch screens and desktop to improve responsiveness.
        className={`relative flex flex-col items-center justify-center p-4 gap-3 rounded-xl cursor-pointer
          border transition-all duration-200 select-none group
          ${isActive 
            ? 'border-blue-300 dark:border-blue-700/50 bg-blue-50 dark:bg-blue-900/20 shadow-sm' 
            : 'border-transparent bg-transparent hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:border-zinc-200 dark:hover:border-zinc-700'}`}
      >
        {/* Action buttons */}
        <div className="absolute top-1.5 right-1.5 hidden group-hover:flex gap-1 z-10">
          <button
            onClick={handleRenameClick}
            title="Rename"
            className="p-1.5 rounded-md text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-white dark:hover:bg-zinc-700 shadow-sm transition-all bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm"
          >
            <Pencil size={12} />
          </button>
          <button
            onClick={handleDelete}
            title="Delete"
            className="p-1.5 rounded-md text-zinc-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-white dark:hover:bg-zinc-700 shadow-sm transition-all bg-zinc-50/80 dark:bg-zinc-800/80 backdrop-blur-sm"
          >
            <Trash2 size={12} />
          </button>
        </div>

        {/* icon */}
        <div className="transition-transform duration-200 group-hover:scale-105 group-hover:-translate-y-1">
          {isFolder ? (
            isActive
              ? <FolderOpen size={48} strokeWidth={1.2} className="text-blue-600 dark:text-blue-400" />
              : <Folder size={48} strokeWidth={1.2} className="text-blue-500 dark:text-blue-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          ) : (
            <FileText size={48} strokeWidth={1.2} className={`transition-colors ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-500 dark:group-hover:text-zinc-400'}`} />
          )}
        </div>

        {/* file or folder name */}
        <span
          className={`text-xs font-medium text-center w-full truncate px-1
            ${isActive ? 'text-blue-800 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-300'}`}
          title={node.name}
        >
          {node.name}
        </span>
      </div>

      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title={`Rename "${node.name}"`}
        onConfirm={(newName) => handleRename(newName)}
        initialName={node.name}
        showTypeSelector={false}
      />
    </>
  );
}
