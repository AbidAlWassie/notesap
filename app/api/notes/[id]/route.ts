// app/api/notes/[id]/route.ts
import { auth } from "@/auth";
import { deleteNote, updateNote } from "@/lib/user-notes";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content } = await req.json();
  await updateNote(session.user.id, params.id, title, content);
  return NextResponse.json({ message: "Note updated successfully" });
}

export async function DELETE(req: NextRequest, context: { params: { id: string } }) {
  const { params } = context;
  const session = await auth();
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await deleteNote(session.user.id, params.id);
  return NextResponse.json({ message: "Note deleted successfully" });
}

