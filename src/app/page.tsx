'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Metadata } from 'next';
import Feed from '@/components/Feed';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'FireWorld - Where Ideas Ignite',
  description: 'Connect and share in the world of FireWorld',
};

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <main className="flex min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-red-900">
      <Sidebar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <Feed />
      </div>
    </main>
  );
} 