import { NextResponse } from 'next/server';
import { messageController } from '@/controllers/messageController';
import { authController } from '@/controllers/authController';

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };
    const { message, toWhoID } = await request.json();
    const newMessage = await messageController.sendMessage(user.userID, message, toWhoID);
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 400 });
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };
    const { searchParams } = new URL(request.url);
    const otherUserID = searchParams.get('otherUserID');

    if (!otherUserID) {
      return NextResponse.json({ error: 'Other user ID is required' }, { status: 400 });
    }

    const messages = await messageController.getMessages(user.userID, otherUserID);
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 400 });
  }
} 