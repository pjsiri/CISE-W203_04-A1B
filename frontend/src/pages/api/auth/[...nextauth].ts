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
        const validUser =
          credentials &&
          (credentials.username === 'analyst' ||
            credentials.username === 'submitter' ||
            credentials.username === 'moderator') &&
          credentials.password === '123';

        if (validUser) {
          // Return the user object with id, name, and role (no email)
          const user = {
            id: credentials.username === 'moderator' ? '1' : credentials.username === 'analyst' ? '2' : '3',
            name: `${credentials.username.charAt(0).toUpperCase() + credentials.username.slice(1)} User`,
            role: credentials.username, // Store role as moderator, analyst, or submitter
          };
          return user; // Return user object
        } else {
          return null; // Authentication failed
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as typeof session.user; // Store token's user in the session
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user; // Store user in token for persistence
      }
      return token;
    },
  },
});