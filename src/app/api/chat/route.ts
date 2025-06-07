import { NextResponse } from 'next/server';
import OpenAI from 'openai';

/**
 * @swagger
 * /chat/rooms:
 *   get:
 *     summary: Pobierz dostępne pokoje czatu
 *     tags: [Chat]
 *     responses:
 *       200:
 *         description: Lista pokojów
 */

/**
 * @swagger
 * /chat/rooms/{roomId}/join:
 *   post:
 *     summary: Dołącz do pokoju
 *     tags: [Chat]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID pokoju
 *     responses:
 *       200:
 *         description: Dołączono
 */



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      message: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    );
  }
} 
