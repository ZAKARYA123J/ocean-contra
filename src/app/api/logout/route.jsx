// pages/api/logout.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  // Here you might want to clear session information or any other logout logic
  // For a JWT setup, just clear the client-side token
  return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
}
