import { NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';
import { messageController } from '@/controllers/messageController';
import { setJWTContext } from '@/lib/supabase';

// Remove the createJWTContextFunction call since it's now handled by SQL migration
// createJWTContextFunction().catch(console.error);

/**
 * @swagger
 * /messages:
 *   post:
 *     summary: Wyślij wiadomość
 *     tags: [Messages]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               recipientId:
 *                 type: string
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Wiadomość wysłana
 */

/**
 * @swagger
 * /messages/{userId}:
 *   get:
 *     summary: Pobierz wiadomości z użytkownikiem
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID odbiorcy
 *     responses:
 *       200:
 *         description: Lista wiadomości
 */

export async function POST(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };
    const { message, toWhoID } = await request.json();

    if (!message || !toWhoID) {
      return NextResponse.json(
        { error: 'Message and recipient ID are required' },
        { status: 400 }
      );
    }

    try {
      const newMessage = await messageController.sendMessage(user.userID, message, toWhoID, token);
      return NextResponse.json(newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in POST /api/messages:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
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

    try {
      const messages = await messageController.getMessages(user.userID, otherUserID, token);
      return NextResponse.json(messages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch messages';
      return NextResponse.json({ error: errorMessage }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in GET /api/messages:', error);
    if (error instanceof Error && error.message.includes('token')) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
} 

