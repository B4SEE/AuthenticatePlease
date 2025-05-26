import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { sessionOptions } from '../../../../lib/auth/config';
import { cookies } from 'next/headers';
import type { IronSessionData } from 'iron-session';

export async function GET() {
  try {
    const session = await getIronSession<IronSessionData>(cookies(), sessionOptions);

    if (!session.user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({ user: session.user });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get user info' },
      { status: 500 }
    );
  }
} 