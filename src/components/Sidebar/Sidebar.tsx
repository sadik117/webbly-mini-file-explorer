'use client';

import { useFileStore } from '@/store/useFileStore';
import TreeNode from './TreeNode';
import { useTheme } from 'next-themes';
import { Sun, Moon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const nodes = useFileStore((state) => state.nodes);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      {/* mobile backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`
        fixed md:relative inset-y-0 left-0 z-50 w-72 md:w-64 h-full shrink-0
        bg-zinc-50/90 dark:bg-zinc-900/90 backdrop-blur-xl border-r border-zinc-200 dark:border-zinc-800
        flex flex-col transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* sidebar header */}
        <div className="p-3.5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <h2 className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">File Explorer</h2>
          
          <div className="flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-1.5 rounded-md text-zinc-500 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                title="Toggle Theme"
              >
                {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
              </button>
            )}
            <button 
              className="md:hidden p-1.5 rounded-md text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* tree view container */}
        <div className="p-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700">
          {nodes.length === 0 ? (
            <p className="text-xs text-zinc-500 dark:text-zinc-400 italic p-2 text-center mt-4">Empty workspace</p>
          ) : (
            nodes.map((node) => <TreeNode key={node.id} node={node} />)
          )}
        </div>
      </div>
    </>
  );
}
