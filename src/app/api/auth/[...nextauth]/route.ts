import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

// 1. Call NextAuth and store the entire result in a temporary variable.
const nextAuthResult = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
});

// 2. Explicitly export the GET and POST handlers for the App Router.
// This is the critical change that fixes the "No HTTP methods exported" error.
export const GET = nextAuthResult.handlers.GET;
export const POST = nextAuthResult.handlers.POST;

// 3. Explicitly export the other helpers for use in your app.
export const auth = nextAuthResult.auth;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;