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
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user) {
        session.user.id = token.sub!
      }
      return session
    },
    async signIn({ user }: { user: { id: string } }) {
      try {
        if (user.id) {
          // Ensure the actual user ID is passed
          await initializeUserDatabase(user.id)
        }
        return true
      } catch (error) {
        console.error("Error in signIn callback:", error)
        return true // Allow sign-in even if there's an error
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error", // Add this line to handle auth errors
  },
  secret: process.env.NEXTAUTH_SECRET,
}
