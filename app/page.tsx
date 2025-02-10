// app/page.tsx
import { auth } from "@/app/(auth)/auth"
import NotesList from "@/components/NotesList"
import { Button } from "@/components/ui/button"
import { getNotes } from "@/lib/user-notes"
import Link from "next/link"

export default async function Home() {
  const session = await auth()

  if (!session?.user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome to Notesap!</h1>
          <p className="mb-8 text-lg">An elegant note-taking solution.</p>
          <Button className="w-24 bg-indigo-600 text-white hover:bg-indigo-700">
            <Link href="/signin">Get started</Link>
          </Button>
        </div>
      </div>
    )
  }

  const notes = await getNotes(session.user.id)

  return <NotesList notes={notes} userId={session.user.id} />
}
