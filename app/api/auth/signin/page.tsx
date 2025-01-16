// app/api/auth/signin/page.tsx

"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { FaGithub, FaGoogle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignIn() {
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  const handleSignIn = (provider: "google" | "github") => {
    setLoadingProvider(provider);
    signIn(provider, { callbackUrl: "/" });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-800 px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-gray-600 bg-slate-700">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-extrabold text-blue-50">
            Sign In
          </CardTitle>
          <CardDescription className="pt-2 text-center text-gray-300">
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button
            onClick={() => handleSignIn("google")}
            disabled={loadingProvider !== null}
            className="w-full bg-blue-700 text-white hover:bg-blue-600"
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
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
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
        </CardContent>
        <CardFooter>
          <p className="mx-auto text-xs text-gray-400">
            By signing in, you agree to our Terms of Service.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
