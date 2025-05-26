import type { SessionOptions } from 'iron-session';

export const sessionOptions: SessionOptions = {
  password: process.env.SECRET_COOKIE_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'auth-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

// Extend the IronSession type to include our user data
declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: string;
      username: string;
      isLoggedIn: boolean;
    };
  }
} 