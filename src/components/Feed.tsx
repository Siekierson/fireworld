'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/database';
import { newsApi } from '@/lib/newsApi';
import PostCard from './PostCard';
import NewsCard from './NewsCard';
import CreatePost from './CreatePost';

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, newsResponse] = await Promise.all([
          fetch('/api/posts'),
          newsApi.getLatestNews()
        ]);

        const postsData = await postsResponse.json();
        setPosts(postsData);
        setNews(newsResponse);
      } catch (error) {
        console.error('Error fetching feed:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-pulse text-orange-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CreatePost onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
      <div className="space-y-4">
        {posts.map((post) => (
          <PostCard key={post.postID} post={post} />
        ))}
      </div>
    </div>
  );
} 