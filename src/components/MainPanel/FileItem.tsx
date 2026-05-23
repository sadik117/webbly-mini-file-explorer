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

  // actions from the store
  const selectFolder = useFileStore((state) => state.selectFolder);
  const openFile = useFileStore((state) => state.openFile);
  const renameNode = useFileStore((state) => state.renameNode);
  const deleteNode = useFileStore((state) => state.deleteNode);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const openFileId = useFileStore((state) => state.openFileId);

  // Local UI state — controls the rename modal visibility
  const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);

  // determine if the item is currently selected or opened
  const isActive = isFolder ? selectedFolderId === node.id : openFileId === node.id;

  // double clicking a folder or file opens it and shows the result in the main panel
  const handleDoubleClick = () => {
    if (isFolder) {
      selectFolder(node.id);
    } else {
      openFile(node.id);
    }
  };

  // Called when user confirms rename in the modal.
  // `type` is ignored here (rename doesn't change type), only `name` matters.
  const handleRename = (newName: string) => {
    renameNode(node.id, newName);
  };

  const handleDelete = (e: React.MouseEvent) => {
    // Stop the click from bubbling up and triggering handleDoubleClick or selecting the item
    e.stopPropagation();
    // Simple confirm dialog for safety — prevents accidental deletions.
    // For folders this also deletes all children (handled by deleteNode in the store).
    const confirmed = window.confirm(
      `Delete "${node.name}"?${isFolder ? '\n\nThis will also delete all contents inside.' : ''}`
    );
    if (confirmed) {
      deleteNode(node.id);
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Don't bubble to item's click/double-click
    setIsRenameModalOpen(true);
  };

  return (
    <>
      <div
        onDoubleClick={handleDoubleClick}
        className={`relative flex flex-col items-center justify-center p-3 gap-2 rounded-lg cursor-pointer
          border border-transparent transition-all select-none group
          hover:border-blue-200 hover:bg-blue-50
          ${isActive ? 'border-blue-300 bg-blue-50' : 'bg-white'}`}
      >
        {/* Action buttons — appear on hover in the top-right corner */}
        <div className="absolute top-1 right-1 hidden group-hover:flex gap-0.5">
          {/* Rename button */}
          <button
            onClick={handleRenameClick}
            title="Rename"
            className="p-1 rounded text-gray-400 hover:text-blue-600 hover:bg-white transition-colors"
          >
            <Pencil size={11} />
          </button>
          {/* Delete button */}
          <button
            onClick={handleDelete}
            title="Delete"
            className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-white transition-colors"
          >
            <Trash2 size={11} />
          </button>
        </div>

        {/* icon making it larger than sidebar icons in grid view */}
        {isFolder ? (
          isActive
            ? <FolderOpen size={40} className="text-blue-600" />
            : <Folder size={40} className="text-blue-400 group-hover:text-blue-500 transition-colors" />
        ) : (
          <FileText size={40} className={`transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`} />
        )}

        {/* file or folder name */}
        <span
          className={`text-xs font-medium text-center w-full truncate
            ${isActive ? 'text-blue-700' : 'text-gray-700'}`}
          title={node.name}
        >
          {node.name}
        </span>
      </div>

      {/* Rename Modal — pre-fills with current node name */}
      <Modal
        isOpen={isRenameModalOpen}
        onClose={() => setIsRenameModalOpen(false)}
        title={`Rename "${node.name}"`}
        onConfirm={(newName) => handleRename(newName)}
        initialName={node.name}
        showTypeSelector={false} // Renaming doesn't change type
      />
    </>
  );
}
