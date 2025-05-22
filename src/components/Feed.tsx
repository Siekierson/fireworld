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

  const fetchPosts = async () => {
    try {
      const postsResponse = await fetch('/api/posts');
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
    } catch (error) {
      console.error('Error fetching posts:', error);
      setError('Failed to load posts');
      setPosts([]);
    }
  };

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

  return (
    <div className="space-y-6 max-w-full">
      {isAuthenticated && <CreatePost onPostCreated={fetchPosts} />}
      
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-pulse text-orange-500">Loading...</div>
        </div>
      ) : (
        <>
          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard
                key={post.postid}
                post={post}
                onPostUpdated={fetchPosts}
              />
            ))
          ) : (
            <div className="text-center text-gray-400 py-8">
              No posts yet. Be the first to post something!
            </div>
          )}

          {news.length > 0 && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-4">Latest News</h2>
              <div className="space-y-4">
                {news.map((item, index) => (
                  <NewsCard key={index} article={item} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 