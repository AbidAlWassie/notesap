// auth/authOptions.ts
import { PrismaAdapter } from "@auth/prisma-adapter"
import { Session, SessionStrategy } from "next-auth"
import { JWT } from "next-auth/jwt"
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
