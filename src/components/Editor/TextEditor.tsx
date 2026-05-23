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
    <div className="absolute inset-0 z-20 md:relative md:inset-auto md:z-auto flex flex-col md:flex-1 h-full bg-white dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 shadow-2xl md:shadow-none transition-colors duration-300">
      
      {/* editor header */}
      <div className="h-14 flex items-center justify-between px-4 sm:px-6 border-b border-zinc-200 dark:border-zinc-800 shrink-0 bg-zinc-50/50 dark:bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-zinc-400 dark:text-zinc-500" />
          <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 truncate max-w-[150px] sm:max-w-xs">{openFile.name}</span>
          {unsavedChanges && (
            <span className="w-2 h-2 rounded-full bg-orange-400 dark:bg-orange-500 shadow-[0_0_8px_rgba(251,146,60,0.6)]" title="Unsaved changes" />
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            disabled={!unsavedChanges}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold tracking-wide rounded-lg
              bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-blue-500/25
              disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all"
          >
            <Save size={14} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
            title="Close file"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ctrl+s hint */}
      <div className="px-4 sm:px-6 py-1.5 bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 shrink-0 flex items-center gap-1">
        Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded text-zinc-600 dark:text-zinc-300 font-mono text-[10px] sm:text-xs shadow-sm">Ctrl+S</kbd> to save
      </div>

      {/* textarea */}
      <textarea
        value={localContent}
        onChange={handleContentChange}
        className="flex-1 w-full p-4 sm:p-6 font-mono text-sm sm:text-base text-zinc-800 dark:text-zinc-200 resize-none outline-none
          leading-relaxed bg-white dark:bg-zinc-950 placeholder-zinc-300 dark:placeholder-zinc-700 transition-colors duration-300"
        placeholder="Start typing..."
        spellCheck={false}
      />
    </div>
  );
}
