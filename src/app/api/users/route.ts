import { NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';
import { supabase } from '@/lib/supabase';

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Pobierz dane użytkownika
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Szczegóły użytkownika
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobierz listę użytkowników
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista użytkowników
 */


export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = authController.verifyToken(token) as { userID: string };

    const { data, error } = await supabase
      .from('users')
      .select('userid, name, imageurl')
      .neq('userid', user.userID) // Exclude current user
      .order('name');

    if (error) throw error;

    // Transform the data to match the expected format
    const users = data.map(user => ({
      userID: user.userid,
      name: user.name,
      imageURL: user.imageurl
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 400 });
  }
} 
