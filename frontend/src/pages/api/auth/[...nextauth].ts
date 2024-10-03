import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        // Add logic to verify the credentials from database later
        // For testing, a user is hard-coded.
        const validUser = credentials && credentials.username === 'analyst' && credentials.password === '123';
        if (validUser) {
          return { id: '1', name: 'Analyst User', role: 'analyst' }; // Return the user object with id as string
        } else {
          return null; // Return null if login fails
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin', // Custom sign-in page
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as typeof session.user; // Assign token's user to the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
  },
});