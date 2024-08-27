// app/api/submit/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { input } = await request.json();
  // Process the submission
  return NextResponse.json({ message: `Submitted: ${input}` });
}
