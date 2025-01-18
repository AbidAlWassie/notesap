// auth/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Session, SessionStrategy } from "next-auth"
import { JWT } from "next-auth/jwt"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import prisma from "../lib/db"
import { initializeUserDatabase } from "../lib/user-notes"

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string } | null }) {
      if (user?.id) {
        token.userId = user.id
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user && token.userId) {
        session.user.id = token.userId as string

        // Check and initialize database during session creation
        try {
          await initializeUserDatabase(session.user.id)
        } catch (error) {
          console.error(
            "Error checking/initializing database during session:",
            error,
          )
          // Don't throw the error to avoid breaking the auth flow
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Add this line to handle auth errors
  },
  secret: process.env.NEXTAUTH_SECRET,
}
