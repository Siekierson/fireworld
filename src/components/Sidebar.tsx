'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import ChatAssistant from './ChatAssistant';

export default function Sidebar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  return (
    <div className="w-64 h-screen bg-gray-800 backdrop-blur-lg p-6 flex flex-col fixed">
      <div className="flex items-center space-x-4 mb-8">
        <Image
          src="/logo.png"
          alt="FireWorld Logo"
          width={40}
          height={40}
          className="rounded-lg"
        />
        <h1 className="text-2xl font-bold text-orange-500">FireWorld</h1>
      </div>

      <nav className="flex-none">
        <ul className="space-y-4">
          <li>
            <Link
              href="/"
              className="flex items-center space-x-4 text-white hover:text-orange-500 transition p-2 rounded-lg hover:bg-white/5"
            >
              <HomeIcon className="h-6 w-6" />
              <span>Home</span>
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="flex items-center space-x-4 text-white hover:text-orange-500 transition p-2 rounded-lg hover:bg-white/5"
            >
              <UserIcon className="h-6 w-6" />
              <span>Profile</span>
            </Link>
          </li>
          <li>
            <Link
              href="/messages"
              className="flex items-center space-x-4 text-white hover:text-orange-500 transition p-2 rounded-lg hover:bg-white/5"
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <span>Messages</span>
            </Link>
          </li>
        </ul>
      </nav>

      <div className="flex-1 mt-4 mb-4">
        <ChatAssistant />
      </div>

      {user && (
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center space-x-4 mb-4">
            {user.imageURL ? (
              <Image
                src={user.imageURL}
                alt={user.name}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <span className="text-white text-lg">{user.name.charAt(0)}</span>
              </div>
            )}
            <div>
              <p className="text-white font-semibold">{user.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 text-white hover:text-orange-500 transition p-2 rounded-lg hover:bg-white/5 w-full"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
} 