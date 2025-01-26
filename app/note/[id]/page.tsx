// app/note/[id]/page.tsx
import { auth } from "@/auth"
import NoteEditor from "@/components/NoteEditor"
import { getNoteById } from "@/lib/user-notes"

export default async function EditNotePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()

  if (!session?.user) {
    return <div>Please sign in to edit this note.</div>
  }

  const note = await getNoteById(session.user.id, id)

  if (!note) {
    return <div>Note not found.</div>
  }

  return <NoteEditor userId={session.user.id} initialNote={note} />
}
