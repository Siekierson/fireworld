import React from 'react';
import { Comment } from '@/models/Comment';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface CommentItemProps {
  comment: Comment;
  currentUserId: string;
  onLike: (commentId: string) => Promise<void>;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onLike
}) => {
  const isLiked = comment.likedBy?.some(
    (id) => id.toString() === currentUserId
  );

  const handleLike = async () => {
    if (comment._id) {
      await onLike(comment._id.toString());
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-gray-800">{comment.content}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
          </p>
        </div>
        <button
          onClick={handleLike}
          className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors"
        >
          {isLiked ? (
            <HeartSolidIcon className="h-5 w-5 text-red-500" />
          ) : (
            <HeartIcon className="h-5 w-5" />
          )}
          <span>{comment.likes}</span>
        </button>
      </div>
    </div>
  );
};

export default CommentItem; 