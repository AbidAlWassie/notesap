"use client"

import { useSession } from "next-auth/react"
import type { ReactNode } from "react"

export function ClientAuthCheck({
  children,
  fallback,
}: {
  children: ReactNode
  fallback: ReactNode
}) {
  const { status } = useSession()

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (status === "unauthenticated") {
    return <>{fallback}</>
  }

  return <>{children}</>
}
