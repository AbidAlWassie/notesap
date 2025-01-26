// auth/index.ts
import { getServerSession } from "next-auth/next"
import { authOptions } from "./authOptions"

export async function auth() {
  const session = await getServerSession(authOptions)
  return session
}
