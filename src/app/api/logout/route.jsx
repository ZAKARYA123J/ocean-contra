// pages/api/logout.js
import { NextResponse } from 'next/server';
function setCorsHeaders(response) {
  response.headers.set('Access-Control-Allow-Origin', '*'); // Replace '*' with a specific domain in production
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return response;
}
export async function POST(req) {
  // Here you might want to clear session information or any other logout logic
  // For a JWT setup, just clear the client-side token
  return setCorsHeaders(NextResponse.json({ message: 'Logged out successfully' }, { status: 200 }));
}
