import { ObjectId } from 'mongodb';

export interface Comment {
  _id?: ObjectId;
  postId: ObjectId;
  userId: ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  likedBy: ObjectId[];
}

export interface CreateCommentDTO {
  postId: string;
  userId: string;
  content: string;
}

export interface UpdateCommentDTO {
  content?: string;
  likes?: number;
  likedBy?: string[];
} 