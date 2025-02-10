// app/api/notes/id/route.ts
import { auth } from "@/app/(auth)/auth"
import { deleteNote, updateNote } from "@/lib/user-notes"
import { NextRequest, NextResponse } from "next/server"

// Define the Context type with params as a Promise
type Context = {
  params: Promise<{ id: string }>
}

export async function PUT(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params // Await the Promise to get params
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

    await updateNote(session.user.id, id, title, content)
    return NextResponse.json({ message: "Note updated successfully" })
  } catch (error) {
    console.error("Error updating note:", error)
    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest, context: Context) {
  try {
    const { id } = await context.params // Await the Promise to get params
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await deleteNote(session.user.id, id)
    return NextResponse.json({ message: "Note deleted successfully" })
  } catch (error) {
    console.error("Error deleting note:", error)
    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 },
    )
  }
}
