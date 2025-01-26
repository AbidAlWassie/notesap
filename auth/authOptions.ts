// auth/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Session, SessionStrategy } from "next-auth"
import type { JWT } from "next-auth/jwt"
import DiscordProvider from "next-auth/providers/discord"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
// import EmailProvider from "next-auth/providers/email"
// import { Resend } from "resend"

import prisma from "../lib/db"
import { initializeUserDatabase } from "../lib/user-notes"
// const resend = new Resend(process.env.RESEND_API_KEY)

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
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    // EmailProvider({
    //   // Use Resend as the email service provider
    //   server: {
    //     host: "smtp.resend.com",
    //     port: 465,
    //     auth: {
    //       user: "resend",
    //       pass: process.env.RESEND_API_KEY,
    //     },
    //   },
    //   from: process.env.EMAIL_FROM || "onboarding@resend.dev",
    //   // Custom sendVerificationRequest function
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     try {
    //       const result = await resend.emails.send({
    //         from: provider.from,
    //         to: identifier,
    //         subject: "Sign in to Notesapp",
    //         html: `<p>Click <a href="${url}">here</a> to sign in to Notesapp.</p>`,
    //       })
    //       console.log("Verification email sent:", result)
    //     } catch (error) {
    //       console.error("Error sending verification email:", error)
    //       throw new Error("Failed to send verification email")
    //     }
    //   },
    // }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string } | null }) {
      if (user?.id) {
        token.userId = user.id
        // Set the token expiry to 7 days from now
        token.exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60
      }
      return token
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session?.user && token.userId) {
        session.user.id = token.userId as string
        // Add expiry to the session
        session.expires = new Date(
          (Number(token.exp) ?? 0) * 1000,
        ).toISOString()

        // Initialize user database only once per session
        if (!token.dbInitialized) {
          try {
            await initializeUserDatabase(session.user.id)
            token.dbInitialized = true
          } catch (error) {
            console.error(
              "Error checking/initializing database during session:",
              error,
            )
            // Don't throw the error to avoid breaking the auth flow
          }
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET,
}
