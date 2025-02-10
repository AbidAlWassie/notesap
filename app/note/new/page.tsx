// app/note/new/page.tsx
import { auth } from "@/app/(auth)/auth"
import NoteEditor from "@/components/NoteEditor"

export default async function NewNotePage() {
  const session = await auth()

  if (!session?.user) {
    return <div>Please sign in to create a note.</div>
  }

  return <NoteEditor userId={session.user.id} />
}
