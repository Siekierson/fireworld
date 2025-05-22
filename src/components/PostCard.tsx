'use client';

import { useState, useEffect } from 'react';
import { Post } from '@/types/database';
import { HeartIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface PostCardProps {
  post: Post;
  onPostUpdated?: () => void;
}

export default function PostCard({ post, onPostUpdated }: PostCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.activities?.filter(a => a.type === 'like').length || 0);
  const [showComments, setShowComments] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    
    // Check if the current user has liked this post
    const userLiked = post.activities?.some(
      activity => activity.type === 'like' && activity.userid === JSON.parse(atob(token?.split('.')[1] || '{}')).userID
    );
    setLiked(!!userLiked);
  }, [post.activities]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      console.log('Post object:', post);
      const requestBody = {
        type: 'like',
        postid: post.postid
      };
      console.log('Sending like request:', requestBody);

      const response = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Like response status:', response.status);
      const responseText = await response.text();
      console.log('Like response text:', responseText);

      if (!response.ok) {
        throw new Error(`Failed to like post: ${responseText}`);
      }

      const data = JSON.parse(responseText);
      console.log('Like response data:', data);
      
      // Update like state and count
      if (data.type === 'unlike') {
        setLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        setLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    setShowComments(!showComments);
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !isAuthenticated || isSubmittingComment) return;

    setIsSubmittingComment(true);
    try {
      const response = await fetch('/api/activity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          type: 'comment',
          postid: post.postid,
          message: commentText.trim()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      console.log('Comment added:', data);
      
      // Reset form and update UI
      setCommentText('');
      // Refresh post data
      onPostUpdated?.();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-md rounded-xl p-6 shadow-lg text-black transition-all hover:bg-white max-w-full">
      <div className="flex items-center space-x-4 mb-4">
        {post.users && (
          <>
            <div className="relative w-12 h-12">
              <img
                src={post.users?.imageurl || '/default-avatar.png'}
                alt={post.users?.name || 'User'}
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/default-avatar.png';
                }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{post.users.name}</h3>
              <p className="text-sm text-gray-600">
                {new Date(post.created_at).toLocaleDateString('en-US', {
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
          disabled={isLoading}
          className={`flex items-center space-x-2 text-sm transition-all duration-200 ${
            liked 
              ? 'text-red-500 hover:text-red-600' 
              : 'hover:text-orange-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!isAuthenticated ? "Login to like" : ""}
        >
          {liked ? (
            <HeartSolidIcon className="h-5 w-5 animate-pulse" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span className="font-medium">{likeCount}</span>
        </button>

        <button
          onClick={handleCommentClick}
          className="flex items-center space-x-2 text-sm hover:text-orange-500 transition"
          title={!isAuthenticated ? "Login to comment" : ""}
        >
          <ChatBubbleLeftIcon className="h-5 w-5" />
          <span>{post.activities?.filter(a => a.type === 'comment').length || 0}</span>
        </button>
      </div>

      {showComments && (
        <div className="mt-4 space-y-4">
          {isAuthenticated && (
            <form onSubmit={handleCommentSubmit} className="mb-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <img
                    src={JSON.parse(atob(localStorage.getItem('token')?.split('.')[1] || '{}')).imageURL || '/default-avatar.png'}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/default-avatar.png';
                    }}
                  />
                </div>
                <div className="flex-1 flex flex-col space-y-2">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none bg-white text-gray-900 placeholder-gray-500"
                    rows={3}
                    disabled={isSubmittingComment}
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingComment || !commentText.trim()}
                    className="self-end px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                  </button>
                </div>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {post.activities
              ?.filter(a => a.type === 'comment')
              .map((comment, index) => {
                console.log('Comment data:', comment);
                return (
                  <div key={index} className="flex items-start space-x-3 bg-white/50 rounded-lg p-3">
                    <div className="flex-shrink-0">
                      <img
                        src={comment.users?.imageurl || '/default-avatar.png'}
                        alt={comment.users?.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/default-avatar.png';
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900">{comment.users?.name}</p>
                        <span className="text-xs text-gray-500">
                          {comment.created_at ? new Date(comment.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 'Invalid date'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800">{comment.message}</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
} 