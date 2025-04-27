import { NextResponse } from 'next/server';
import { activityController } from '@/controllers/activityController';
import { authController } from '@/controllers/authController';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };
    const { type, postID, message } = await request.json();

    if (!type || !postID) {
      return NextResponse.json(
        { error: 'Type and postID are required' },
        { status: 400 }
      );
    }

    const activity = await activityController.createActivity(type, postID, user.userID, message);
    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error in POST /api/activity:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create activity' },
      { status: 400 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const postID = searchParams.get('postID');

    if (!postID) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const activities = await activityController.getPostActivities(postID);
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };
    const { activityID } = await request.json();
    await activityController.deleteActivity(activityID, user.userID);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete activity' }, { status: 400 });
  }
} 