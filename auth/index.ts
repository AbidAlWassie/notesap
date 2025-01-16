// auth/index.ts
import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);

export async function auth() {
  const session = await NextAuth(authOptions);
  return session;
}
