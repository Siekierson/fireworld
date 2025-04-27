import { NextResponse } from 'next/server';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/lib/mongodb';
import { Comment, CreateCommentDTO } from '@/models/Comment';

export async function POST(request: Request) {
  try {
    const { postId, userId, content }: CreateCommentDTO = await request.json();
    
    if (!postId || !userId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const comment: Comment = {
      postId: new ObjectId(postId),
      userId: new ObjectId(userId),
      content,
      createdAt: new Date(),
      updatedAt: new Date(),
      likes: 0,
      likedBy: []
    };

    const result = await db.collection('comments').insertOne(comment);
    
    return NextResponse.json({ 
      success: true, 
      comment: { ...comment, _id: result.insertedId } 
    });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const comments = await db.collection('comments')
      .find({ postId: new ObjectId(postId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
} 