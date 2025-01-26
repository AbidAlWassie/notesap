// app/page.tsx
import { auth } from "@/auth"
import NotesList from "@/components/NotesList"
import { getNotes } from "@/lib/user-notes"

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">Not Found</div>
      </div>
    )
  }

  const notes = await getNotes(session.user.id)

  return <NotesList notes={notes} userId={session.user.id} />
}
