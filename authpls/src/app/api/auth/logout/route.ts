import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../../lib/auth/config';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const session = await getIronSession(cookies(), sessionOptions);
    session.destroy();

    return NextResponse.json({ message: 'Logged out successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Logout failed' },
      { status: 500 }
    );
  }
} 