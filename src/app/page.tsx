import Sidebar from '@/components/Sidebar/Sidebar';

export default function Home() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Tree View */}
      <Sidebar />

      {/* Main Content Area (will be built in Step 4 & 6) */}
      <main className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <p>Main Panel Area</p>
      </main>
    </div>
  );
}
