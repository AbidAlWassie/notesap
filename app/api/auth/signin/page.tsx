// app/api/auth/signin/page.tsx
"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { FaDiscord, FaGithub, FaGoogle } from "react-icons/fa"

function SignInComponent() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [email, setEmail] = useState("")
  const searchParams = useSearchParams()

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return <div>Loading...</div>
  }

  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/"

  const handleSignIn = async (
    provider: "google" | "github" | "discord" | "email",
  ) => {
    try {
      setLoadingProvider(provider)
      if (provider === "email") {
        await signIn("email", { email, callbackUrl, redirect: false })
      } else {
        await signIn(provider, { callbackUrl, redirect: true })
      }
    } catch (error) {
      console.error("Sign in error:", error)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-900 to-indigo-900 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-indigo-600 bg-indigo-950/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-indigo-100">
            Welcome to Notesap
          </CardTitle>
          <CardDescription className="pt-2 text-center text-indigo-300">
            Choose your preferred sign-in method
          </CardDescription>
          {error && (
            <p className="mt-2 text-center text-sm text-red-400">
              {error === "AccessDenied"
                ? "Access denied. Please try again."
                : "An error occurred. Please try again."}
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={() => handleSignIn("google")}
            disabled={loadingProvider !== null}
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            {loadingProvider === "google" ? (
              "Loading..."
            ) : (
              <>
                <FaGoogle className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign in with Google
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSignIn("github")}
            disabled={loadingProvider !== null}
            className="w-full bg-gray-800 text-white hover:bg-gray-900"
          >
            {loadingProvider === "github" ? (
              "Loading..."
            ) : (
              <>
                <FaGithub className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign in with GitHub
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSignIn("discord")}
            disabled={loadingProvider !== null}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
          >
            {loadingProvider === "discord" ? (
              "Loading..."
            ) : (
              <>
                <FaDiscord className="mr-2 h-4 w-4" aria-hidden="true" />
                Sign in with Discord
              </>
            )}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-indigo-600" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-indigo-950 px-2 text-indigo-400">
                Or continue with
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-indigo-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-slate-700 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
            />
          </div>
          <Button
            onClick={() => handleSignIn("email")}
            disabled={loadingProvider !== null || !email}
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
          >
            {loadingProvider === "email"
              ? "Sending link..."
              : "Sign in with Email"}
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-xs text-indigo-300">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="text-xs text-slate-400">
            <p>
              Developed with 🍵 by{" "}
              <Link
                href="https://github.com/AbidAlWassie"
                target="_blank"
                className="font-bold text-blue-400"
              >
                Abid Al Wassie
              </Link>
              .
            </p>
            <p>© 2024 Notesap. All rights reserved.</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInComponent />
    </Suspense>
  )
}
