import React from 'react';
import { Comment } from '@/models/Comment';
import CommentItem from './CommentItem';

interface CommentListProps {
  comments: Comment[];
  currentUserId: string;
  onLike: (commentId: string) => Promise<void>;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  currentUserId,
  onLike
}) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id?.toString()}
          comment={comment}
          currentUserId={currentUserId}
          onLike={onLike}
        />
      ))}
    </div>
  );
};

export default CommentList; 