import { auth } from "@/app/(auth)/auth"
import { getNotes } from "@/lib/user-notes"
import { NextResponse } from "next/server"

export async function GET() {
  const session = await auth()

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const notes = await getNotes(session.user.id)
  return NextResponse.json(notes)
}
