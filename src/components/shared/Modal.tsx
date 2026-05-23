'use client';

import { useState, useEffect } from 'react';

interface ModalProps {

  isOpen: boolean;
  onClose: () => void;
  title: string;
  onConfirm: (name: string, type: 'folder' | 'file') => void;
  // pre-fill the input used for rename pass in the current name
  initialName?: string;
  // show the folder or file radio selector used for creating
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

  // every time the modal opens reset the internal state
  // without this re-opening the modal would show stale values from last time
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setType('folder');
    }
  }, [isOpen, initialName]);

  // listen for the escape key on keyboard globally while the modal is open
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

    // prevent empty submissions
    if (!name.trim()) return;

    onConfirm(name.trim(), type);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* header */}
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h3 className="font-semibold text-gray-800 text-sm">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors text-lg leading-none">
            &times;
          </button>
        </div>

        {/* form body */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              placeholder="Enter name..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm
                outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition"
            />
          </div>

          {showTypeSelector && (
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">Type</label>
              <div className="flex gap-5">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    name="nodeType"
                    value="folder"
                    checked={type === 'folder'}
                    onChange={() => setType('folder')}
                  />
                  Folder
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-700">
                  <input
                    type="radio"
                    name="nodeType"
                    value="file"
                    checked={type === 'file'}
                    onChange={() => setType('file')}
                  />
                  Text File
                </label>
              </div>
            </div>
          )}

          {/* footer buttons */}
          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-4 py-1.5 text-sm bg-blue-600 text-white rounded-lg
                hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
