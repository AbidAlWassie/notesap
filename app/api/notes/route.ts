// app/api/notes/route.ts

import { auth } from "@/auth"
import { createNote, getNotes } from "@/lib/user-notes"
import { NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("Fetching notes for user:", session.user.id)
    const notes = await getNotes(session.user.id)
    return NextResponse.json(notes)
  } catch (error) {
    console.error("Failed to fetch notes:", error)
    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title, content } = await req.json()
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 },
      )
    }

    console.log("Creating note for user:", session.user.id)
    const noteId = await createNote(session.user.id, title, content)
    return NextResponse.json({ id: noteId })
  } catch (error) {
    console.error("Failed to create note:", error)
    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 },
    )
  }
}
