'use client';

import { useState, useEffect } from 'react';
import { useFileStore } from '@/store/useFileStore';
import { findNode } from '@/utils/treeHelpers';
import { Save, X, FileText } from 'lucide-react';

export default function TextEditor() {
  const openFileId = useFileStore((state) => state.openFileId);
  const nodes = useFileStore((state) => state.nodes);
  const updateFileContent = useFileStore((state) => state.updateFileContent);
  const closeFile = useFileStore((state) => state.closeFile);

  const openFile = openFileId ? findNode(nodes, openFileId) : null;

  const [localContent, setLocalContent] = useState('');
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  useEffect(() => {
    if (openFile) {
      setLocalContent(openFile.content ?? '');
      setUnsavedChanges(false);
    }
  }, [openFileId]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setLocalContent(e.target.value);
    setUnsavedChanges(true);
  };

  const handleSave = () => {
    if (!openFileId) return;
    updateFileContent(openFileId, localContent);
    setUnsavedChanges(false);
  };

  const handleClose = () => {
    if (unsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Close without saving?');
      if (!confirmed) return;
    }
    closeFile();
  };

  // ctrl+s keyboard shortcut for saving
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localContent, openFileId]);

  if (!openFile) return null;

  return (
    <div className="flex flex-col flex-1 h-full bg-white border-l border-gray-200">

      {/* editor header */}
      <div className="h-12 flex items-center justify-between px-4 border-b border-gray-200 shrink-0 bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText size={15} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-700">{openFile.name}</span>
          {unsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-orange-400" title="Unsaved changes" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!unsavedChanges}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
              bg-blue-600 text-white hover:bg-blue-700
              disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Save size={12} />
            Save
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
            title="Close file"
          >
            <X size={15} />
          </button>
        </div>
      </div>

      {/* ctrl+s hint */}
      <div className="px-4 py-1 bg-gray-50 border-b border-gray-100 text-xs text-gray-400 shrink-0">
        Press <kbd className="px-1 py-0.5 bg-gray-200 rounded text-gray-500 font-mono text-xs">Ctrl+S</kbd> to save
      </div>

      {/* textarea */}
      <textarea
        value={localContent}
        onChange={handleContentChange}
        className="flex-1 w-full p-4 font-mono text-sm text-gray-800 resize-none outline-none
          leading-relaxed bg-white placeholder-gray-300"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
}
