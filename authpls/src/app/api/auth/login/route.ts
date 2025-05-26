import { NextResponse } from 'next/server';
import { findUser, verifyPassword } from '../../../../lib/auth/server-store';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../../lib/auth/config';
import { cookies } from 'next/headers';
import type { IronSessionData } from 'iron-session';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = findUser(username);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(user, password);
    
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const session = await getIronSession<IronSessionData>(cookies(), sessionOptions);

    // Set user session
    session.user = {
      id: user.id,
      username: user.username,
      isLoggedIn: true,
    };
    await session.save();

    return NextResponse.json({ 
      message: 'Login successful',
      user: {
        id: user.id,
        username: user.username,
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
} 