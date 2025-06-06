'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  ArrowLeftOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const NavLinks = () => (
    <>
      <li>
        <Link
          href="/"
          className={`flex items-center space-x-4 text-orange-500 hover:text-orange-400 transition p-3 rounded-lg hover:bg-white/5 text-xl font-semibold ${
            pathname === '/' ? 'text-orange-400 bg-white/5' : ''
          }`}
        >
          <HomeIcon className="h-8 w-8" />
          <span>Home</span>
        </Link>
      </li>
      <li>
        <Link
          href="/profile"
          className={`flex items-center space-x-4 text-orange-500 hover:text-orange-400 transition p-3 rounded-lg hover:bg-white/5 text-xl font-semibold ${
            pathname === '/profile' ? 'text-orange-400 bg-white/5' : ''
          }`}
        >
          <UserIcon className="h-8 w-8" />
          <span>Profile</span>
        </Link>
      </li>
      <li>
        <Link
          href="/messages"
          className={`flex items-center space-x-4 text-orange-500 hover:text-orange-400 transition p-3 rounded-lg hover:bg-white/5 text-xl font-semibold ${
            pathname === '/messages' ? 'text-orange-400 bg-white/5' : ''
          }`}
        >
          <ChatBubbleLeftRightIcon className="h-8 w-8" />
          <span>Messages</span>
        </Link>
      </li>
    </>
  );

  const UserSection = () => (
    <>
      {user && (
        <div className="p-8">
          <Link
            href="/profile"
            className="flex items-center space-x-4 mb-4 hover:bg-white/5 rounded-lg p-2 transition cursor-pointer"
          >
            {user.imageURL ? (
              <Image
                src={user.imageURL}
                alt={user.name || 'User'}
                width={56}
                height={56}
                className="rounded-full"
              />
            ) : (
              <Image
                src="/default-avatar.png"
                alt="Default Avatar"
                width={56}
                height={56}
                className="rounded-full"
              />
            )}
            <div>
              <p className="text-orange-500 font-bold text-xl">{user.name}</p>
            </div>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-4 text-orange-500 hover:text-orange-400 transition p-3 rounded-lg hover:bg-white/5 w-full text-xl font-semibold"
          >
            <ArrowLeftOnRectangleIcon className="h-8 w-8" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Navbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#541010] backdrop-blur-lg">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Image
              src="/logo.png"
              alt="FireWorld Logo"
              width={48}
              height={48}
              className="rounded-lg"
            />
            <h1 className="text-3xl font-bold text-orange-500">FireWorld</h1>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-orange-500 p-3 hover:text-orange-400 transition"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-10 w-10" />
            ) : (
              <Bars3Icon className="h-10 w-10" />
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="bg-[#541010] backdrop-blur-lg border-t border-white/10">
            <nav className="p-4">
              <ul className="space-y-3">
                <NavLinks />
              </ul>
            </nav>
            <div className="p-4 border-t border-white/10">
              <UserSection />
            </div>
          </div>
        )}
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-screen bg-[#541010] backdrop-blur-lg p-8 flex flex-col fixed left-0 top-0">
        <div className="flex-none flex items-center space-x-4 mb-10">
          <Image
            src="/logo.png"
            alt="FireWorld Logo"
            width={56}
            height={56}
            className="rounded-lg"
          />
          <h1 className="text-4xl font-bold text-orange-500">FireWorld</h1>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            <NavLinks />
          </ul>
        </nav>
      </div>

      {/* Desktop User Section - Fixed to bottom */}
      <div className="hidden lg:block w-72 fixed left-0 bottom-0 bg-[#541010] backdrop-blur-lg border-t border-white/10">
        <UserSection />
      </div>

      {/* Spacer for mobile navbar */}
      <div className="lg:hidden h-20" />
    </>
  );
} 