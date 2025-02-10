// app/(auth)/auth.config.ts
import type { NextAuthConfig } from "next-auth"
import Discord from "next-auth/providers/discord"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const authConfig = {
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/auth/error",
    newUser: "/",
  },
  providers: [GitHub, Google, Discord],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false // Redirect unauthenticated users to login page
      }
      return true
    },
  },
} satisfies NextAuthConfig
