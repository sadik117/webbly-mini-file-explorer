import Sidebar from '@/components/Sidebar/Sidebar';
import MainPanel from '@/components/MainPanel/MainPanel';
import TextEditor from '@/components/Editor/TextEditor';

export default function Home() {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <MainPanel />
      <TextEditor />
    </div>
  );
}
