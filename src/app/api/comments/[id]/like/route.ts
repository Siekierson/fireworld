import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const commentId = new ObjectId(params.id);
    const userIdObj = new ObjectId(userId);

    // Check if user already liked the comment
    const comment = await db.collection('comments').findOne({
      _id: commentId,
      likedBy: userIdObj
    });

    if (comment) {
      // Unlike
      await db.collection('comments').updateOne(
        { _id: commentId },
        {
          $inc: { likes: -1 },
          $pull: { likedBy: userIdObj }
        }
      );
    } else {
      // Like
      await db.collection('comments').updateOne(
        { _id: commentId },
        {
          $inc: { likes: 1 },
          $push: { likedBy: userIdObj }
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error handling comment like:', error);
    return NextResponse.json(
      { error: 'Failed to handle comment like' },
      { status: 500 }
    );
  }
} 