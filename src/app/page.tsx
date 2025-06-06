'use client';

import Feed from '@/components/Feed';
import Sidebar from '@/components/Sidebar';

export default function Home() {
  return (
    <main className="flex min-h-screen w-full">
      <div className="fixed left-0 top-0 h-full w-64">
        <Sidebar />
      </div>
      <div className="ml-10 flex-1 flex justify-center">
        <div className="w-full max-w-6xl px-4 py-8">
          <Feed />
        </div>
      </div>
    </main>
  );
} 