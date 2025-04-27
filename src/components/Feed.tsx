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
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, newsResponse] = await Promise.all([
          fetch('/api/posts'),
          newsApi.getLatestNews()
        ]);

        if (!postsResponse.ok) {
          throw new Error('Failed to fetch posts');
        }

        const postsData = await postsResponse.json();
        
        if (!Array.isArray(postsData)) {
          console.error('Posts data is not an array:', postsData);
          setPosts([]);
          setError('Invalid posts data format');
          return;
        }

        setPosts(postsData);
        setNews(newsResponse);
      } catch (error) {
        console.error('Error fetching feed:', error);
        setError('Failed to load posts');
        setPosts([]);
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
      {isAuthenticated && (
        <div className="mb-6">
          <CreatePost onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
        </div>
      )}
      
      <div className="space-y-4">
        {error ? (
          <div className="text-center text-gray-400 py-8 bg-white/5 rounded-lg">
            {error === 'Failed to load posts' ? 'No posts available' : error}
          </div>
        ) : posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={`${post.postID}-${post.created_at}`} post={post} />
          ))
        ) : (
          <div className="text-center text-gray-400 py-8 bg-white/5 rounded-lg">
            No posts available
          </div>
        )}
      </div>

      {news.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-white mb-4">Latest News</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {news.map((item, index) => (
              <NewsCard key={index} article={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 