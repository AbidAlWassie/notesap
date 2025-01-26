"use client"

import { Button } from "@/components/ui/button"
import { signIn } from "next-auth/react"

export default function SignInButton() {
  return (
    <Button
      onClick={() => signIn()}
      className="bg-indigo-600 text-indigo-50 hover:bg-indigo-700"
    >
      Sign In
    </Button>
  )
}
