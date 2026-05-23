import Sidebar from '@/components/Sidebar/Sidebar';
import MainPanel from '@/components/MainPanel/MainPanel';

export default function Home() {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <Sidebar />
      <MainPanel />
    </div>
  );
}
