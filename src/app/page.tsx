'use client';

import { useState } from 'react';
import Sidebar from '@/components/Sidebar/Sidebar';
import MainPanel from '@/components/MainPanel/MainPanel';
import TextEditor from '@/components/Editor/TextEditor';
import { Menu } from 'lucide-react';

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col md:flex-row h-[100dvh] bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 overflow-hidden">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md z-30 shrink-0">
        <h1 className="text-sm font-semibold tracking-wider text-zinc-800 dark:text-zinc-200">File Explorer</h1>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 transition-colors"
        >
          <Menu size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <MainPanel />
        <TextEditor />
      </div>

    </div>
  );
}
