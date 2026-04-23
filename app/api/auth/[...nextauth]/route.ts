import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getUserByEmail, createUser } from '@/lib/auth';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Check if user exists
        const existingUser = await getUserByEmail(user.email!);

        if (!existingUser) {
          // Create new user with Google OAuth
          await createUser(
            user.name || 'Google User',
            user.email!,
            '', // No password for OAuth users
            '', // No verification token needed
            undefined, // No age
            'user' // Default role
          );
        }

        return true;
      } catch (error) {
        console.error('Google OAuth sign-in error:', error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };