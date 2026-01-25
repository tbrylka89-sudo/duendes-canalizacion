import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Test OK', timestamp: new Date().toISOString() });
}

export async function POST(request) {
  const body = await request.json();
  return NextResponse.json({
    success: true,
    received: body,
    message: 'POST OK'
  });
}
