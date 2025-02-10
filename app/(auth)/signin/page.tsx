// app/(auth)/signin/page.tsx
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { signIn } from "next-auth/react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import {
  FaDiscord,
  FaEye,
  FaEyeSlash,
  FaGithub,
  FaGoogle,
} from "react-icons/fa"

function SignInComponent() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [email, setEmail] = useState("")
  const [signupEmail, setSignupEmail] = useState("")
  const [signupUsername, setSignupUsername] = useState("")
  const [signupPassword, setSignupPassword] = useState("")
  const [signinPassword, setSigninPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
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

  const handleSignUp = async () => {
    try {
      setLoadingProvider("email")
      // Implement your signup logic here
      console.log("Sign up with:", {
        email: signupEmail,
        username: signupUsername,
        password: signupPassword,
      })
    } catch (error) {
      console.error("Sign up error:", error)
    } finally {
      setLoadingProvider(null)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-indigo-400 bg-indigo-950/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-indigo-100">
            Welcome to myApp
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
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-indigo-900/50 text-indigo-300">
              <TabsTrigger
                value="signin"
                className="text-indigo-300 data-[state=active]:bg-indigo-800 data-[state=active]:text-indigo-50"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                className="text-indigo-300 data-[state=active]:bg-indigo-800 data-[state=active]:text-indigo-50"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-indigo-300">
                  Email
                </Label>
                <Input
                  id="signin-email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-indigo-700 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-indigo-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    className="border-indigo-700 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                onClick={() => handleSignIn("email")}
                disabled={loadingProvider !== null || !email || !signinPassword}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loadingProvider === "email" ? "Signing in..." : "Sign in"}
              </Button>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-username" className="text-indigo-300">
                  Username
                </Label>
                <Input
                  id="signup-username"
                  type="text"
                  value={signupUsername}
                  onChange={(e) => setSignupUsername(e.target.value)}
                  className="border-indigo-700 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-indigo-300">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="border-indigo-700 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-indigo-300">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Choose a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="border-indigo-700 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400 hover:text-indigo-300"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="h-4 w-4" />
                    ) : (
                      <FaEye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              <Button
                onClick={() => handleSignUp()}
                disabled={loadingProvider !== null}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {loadingProvider === "email"
                  ? "Creating account..."
                  : "Create account"}
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 text-center">
          <p className="text-xs text-indigo-300">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
          <div className="text-xs text-indigo-400">
            <p>
              Developed with 🍵 by{" "}
              <Link
                href="https://github.com/AbidAlWassie"
                target="_blank"
                className="font-bold text-indigo-300"
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
