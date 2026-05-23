'use client';

import { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (name: string, type: 'folder' | 'file') => void;
  initialName?: string;
  showTypeSelector?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  onConfirm,
  initialName = '',
  showTypeSelector = false,
}: ModalProps) {

  const [name, setName] = useState(initialName);
  const [type, setType] = useState<'folder' | 'file'>('folder');

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setType('folder');
    }
  }, [isOpen, initialName]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm(name.trim(), type);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 dark:bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-xl shadow-2xl shadow-black/20 w-full max-w-sm overflow-hidden m-4 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center bg-zinc-50/50 dark:bg-zinc-900/50">
          <h3 className="font-semibold text-zinc-800 dark:text-zinc-100 text-sm">{title}</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors text-lg leading-none">
            &times;
          </button>
        </div>

        {/* form body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

          <div>
            <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder="Enter name..."
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100
                outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-zinc-400 dark:placeholder:text-zinc-600"
            />
          </div>

          {showTypeSelector && (
            <div>
              <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">Type</label>
              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="nodeType"
                    value="folder"
                    checked={type === 'folder'}
                    onChange={() => setType('folder')}
                    className="accent-blue-600 dark:accent-blue-500"
                  />
                  Folder
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-700 dark:text-zinc-300">
                  <input
                    type="radio"
                    name="nodeType"
                    value="file"
                    checked={type === 'file'}
                    onChange={() => setType('file')}
                    className="accent-blue-600 dark:accent-blue-500"
                  />
                  Text File
                </label>
              </div>
            </div>
          )}

          {/* footer buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 shadow-sm hover:shadow-blue-500/25 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
