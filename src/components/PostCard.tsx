'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/database';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleLike = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: 'Like',
          postid: post.postid
        })
      });

      if (response.ok) {
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setShowComments(!showComments);
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg text-black transition-all hover:bg-white">
      <div className="flex items-center space-x-4 mb-4">
        {post.users && (
          <>
            <div className="relative w-12 h-12">
              <img
                src={post.users.imageurl || '/default-avatar.png'}
                alt={post.users.name}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{post.users.name}</h3>
              <p className="text-sm text-gray-600">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </>
        )}
      </div>

      <p className="mb-4 text-gray-800">{post.text}</p>

      <div className="flex items-center space-x-6 border-t border-gray-200 pt-4">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 text-sm hover:text-orange-500 transition"
          title={!isAuthenticated ? "Login to like" : ""}
        >
          {liked ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span>{post.activities?.filter(a => a.type === 'Like').length || 0}</span>
        </button>

        <button
          onClick={handleCommentClick}
          className="flex items-center space-x-2 text-sm hover:text-orange-500 transition"
          title={!isAuthenticated ? "Login to comment" : ""}
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span>{post.activities?.filter(a => a.type === 'Comment').length || 0}</span>
        </button>
      </div>

      {showComments && post.activities && (
        <div className="mt-4 space-y-2">
          {post.activities
            .filter(a => a.type === 'Comment')
            .map((comment, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-3">
                <p className="text-sm text-gray-800">{comment.message}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
} 