'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from '@/components/Sidebar';
import PostCard from '@/components/PostCard';
import { Post } from '@/types/database';

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userResponse, postsResponse] = await Promise.all([
          fetch('/api/auth', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }),
          fetch('/api/posts', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        ]);

        if (userResponse.ok && postsResponse.ok) {
          const [userData, postsData] = await Promise.all([
            userResponse.json(),
            postsResponse.json()
          ]);

          setUser(userData);
          setPosts(postsData.filter((post: Post) => post.ownerID === userData.userID));
        } else {
          localStorage.removeItem('token');
          router.push('/login');
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-red-900">
        <Sidebar />
        <div className="flex-1 flex justify-center items-center">
          <div className="animate-pulse text-orange-500">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-orange-900 via-red-800 to-red-900">
      <Sidebar />
      <div className="flex-1 container mx-auto px-4 py-8 pl-72">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 mb-8">
          <div className="flex items-center space-x-6">
            <Image
              src={user.imageURL}
              alt={user.name}
              width={120}
              height={120}
              className="rounded-full"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
              <p className="text-gray-300">
                {posts.length} {posts.length === 1 ? 'post' : 'posts'}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.postID} post={post} />
          ))}
          {posts.length === 0 && (
            <div className="text-center text-gray-400 py-8">
              No posts yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 