import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// Extend the Session type to include accessToken
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessToken?: string;
    };
  }
}

// Extend the JWT type to include accessToken
declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export const authOptions = {
  // 1) Configure Google as an OAuth provider
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",               // force consent screen every time
          access_type: "offline",          // so you get a refresh_token
          response_type: "code"
        }
      }
    }),
  ],

  // 2) Use JSON Web Tokens for session instead of database sessions
  session: { strategy: "jwt" as const },

  // 3) Define callbacks to include extra info in the JWT/session
  callbacks: {
    async jwt({ token, account }: { token: JWT; account: any }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      // Make the token available on the client via `useSession()`
      session.user.accessToken = token.accessToken;
      return session;
    },
  },

  // 4) Protect your tokens, signing them with a secret
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

// Next.js Route Handlers must export both GET and POST
export { handler as GET, handler as POST };
