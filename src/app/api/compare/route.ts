// app/api/compare/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { input } = await request.json();
  // Process the comparison
  return NextResponse.json({ message: `Compared: ${input}` });
}
