'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Post } from '@/types/database';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PostCardProps {
  post: Post;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      const response = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: 'Like',
          postID: post.postID
        })
      });

      if (response.ok) {
        setLiked(true);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg text-white">
      <div className="flex items-center space-x-4 mb-4">
        {post.users && (
          <>
            <Image
              src={post.users.imageURL}
              alt={post.users.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-semibold">{post.users.name}</h3>
              <p className="text-sm text-gray-300">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </>
        )}
      </div>

      <p className="mb-4">{post.text}</p>

      <div className="flex items-center space-x-6">
        <button
          onClick={handleLike}
          className="flex items-center space-x-2 text-sm hover:text-orange-500 transition"
        >
          {liked ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span>{post.activities?.filter(a => a.type === 'Like').length || 0}</span>
        </button>

        <button
          onClick={() => setShowComments(!showComments)}
          className="flex items-center space-x-2 text-sm hover:text-orange-500 transition"
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
              <div key={index} className="bg-white/5 rounded p-3">
                <p className="text-sm">{comment.message}</p>
              </div>
            ))}
        </div>
      )}
    </div>
  );
} 