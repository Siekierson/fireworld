import { NextResponse } from 'next/server';
import { postController } from '@/controllers/postController';
import { authController } from '@/controllers/authController';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };
    const { text } = await request.json();
    const post = await postController.createPost(text, user.userID);
    return NextResponse.json(post);
  } catch (error) {
    console.error('Error in POST /api/posts:', error);
    return NextResponse.json({ error: 'Failed to create post' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    console.log('GET /api/posts called');
    const posts = await postController.getPosts();
    console.log('Posts fetched successfully:', posts);
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error in GET /api/posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };
    const { postID } = await request.json();
    await postController.deletePost(postID, user.userID);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in DELETE /api/posts:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 400 });
  }
} 