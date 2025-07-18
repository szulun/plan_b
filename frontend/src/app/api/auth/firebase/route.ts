import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { firebaseToken } = await request.json();
    if (!firebaseToken) {
      return NextResponse.json({ error: 'Firebase token is required' }, { status: 400 });
    }
    const decodedToken = decodeJWT(firebaseToken);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid Firebase token' }, { status: 401 });
    }
    const user = {
      id: decodedToken.user_id || decodedToken.sub,
      email: decodedToken.email || 'user@example.com',
      name: decodedToken.name || decodedToken.email?.split('@')[0] || 'User',
    };
    console.log('JWT_SECRET in API Route:', process.env.JWT_SECRET);
    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name },
      process.env.JWT_SECRET || 'plan-b-portfolio-jwt-secret-2024-zoeyhuang1-super-secure-key',
      { expiresIn: '7d', algorithm: 'HS256' }
    );
    console.log('JWT generated in API Route:', token);
    return NextResponse.json({ token, user });
  } catch (error) {
    console.error('Firebase auth error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
} 