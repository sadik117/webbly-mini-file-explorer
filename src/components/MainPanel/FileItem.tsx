'use client';

import { FileNode } from '@/types';
import { useFileStore } from '@/store/useFileStore';
import { Folder, FileText } from 'lucide-react';

interface FileItemProps {
  node: FileNode;
}

export default function FileItem({ node }: FileItemProps) {
  const isFolder = node.type === 'folder';
  
  // actions from the store
  const selectFolder = useFileStore((state) => state.selectFolder);
  const openFile = useFileStore((state) => state.openFile);
  const selectedFolderId = useFileStore((state) => state.selectedFolderId);
  const openFileId = useFileStore((state) => state.openFileId);

  // determine if the item is currently selected or opened
  const isActive = isFolder ? selectedFolderId === node.id : openFileId === node.id;

  // double clicking a folder or file opens it and shows the result in the result panel
  const handleDoubleClick = () => {
    if (isFolder) {
      selectFolder(node.id);
    } else {
      openFile(node.id);
    }
  };

  return (
    <div
      onDoubleClick={handleDoubleClick}
      className={`flex flex-col items-center justify-center p-3 gap-2 rounded-lg cursor-pointer
        border border-transparent transition-all select-none group
        hover:border-blue-200 hover:bg-blue-50
        ${isActive ? 'border-blue-300 bg-blue-50' : 'bg-white'}`}
    >
      {/* icon making it larger than sidebar icons in grid view */}
      {isFolder ? (
        <Folder
          size={40}
          className={`transition-colors ${isActive ? 'text-blue-600' : 'text-blue-400 group-hover:text-blue-500'}`}
        />
      ) : (
        <FileText
          size={40}
          className={`transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
        />
      )}

       {/* file or folder name  */}
      <span
        className={`text-xs font-medium text-center w-full truncate
          ${isActive ? 'text-blue-700' : 'text-gray-700'}`}
        title={node.name}
      >
        {node.name}
      </span>
    </div>
  );
}
