// middleware.ts

import { NextRequest as NextRequestBase, NextResponse } from "next/server";
import { auth } from "./auth";

interface NextRequest extends NextRequestBase {
  auth?: { userId: string; token: string };
}

export default auth((req: NextRequest) => {
  const isAuthenticated = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/api/auth");

  if (isAuthPage) {
    return NextResponse.next();
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/api/auth/signin", req.url));
  }

  return NextResponse.next();
}) as (req: NextRequest) => Promise<NextResponse>;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
