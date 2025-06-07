// src/app/api/api-docs/route.ts
import { NextRequest } from 'next/server';
import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fireworld API',
      version: '1.0.0',
      description: 'Dokumentacja API dla Fireworld',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/app/api/**/*.ts'], // Ścieżka do Twoich route.ts
};

const swaggerSpec = swaggerJSDoc(options);

export async function GET(req: NextRequest) {
  return new Response(JSON.stringify(swaggerSpec), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}