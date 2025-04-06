import { NextResponse } from 'next/server';
import { authController } from '@/controllers/authController';

export async function POST(request: Request) {
  try {
    const { name, password, imageURL } = await request.json();
    const result = await authController.register(name, password, imageURL);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const { name, password } = await request.json();
    const result = await authController.login(name, password);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 401 });
  }
}

export async function GET(request: Request) {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }
    const user = authController.verifyToken(token);
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
} 