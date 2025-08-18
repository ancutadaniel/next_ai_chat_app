// In: src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';

const nextAuthResult = NextAuth({
  providers: [
    GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  // Add this callbacks object to modify the session
  callbacks: {
    async session({ session, token }) {
      // The 'sub' property on the token is the user's unique ID from the provider (e.g., GitHub ID)
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});

export const GET = nextAuthResult.handlers.GET;
export const POST = nextAuthResult.handlers.POST;
export const auth = nextAuthResult.auth;
export const signIn = nextAuthResult.signIn;
export const signOut = nextAuthResult.signOut;