"use client"

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import NotesList from "./NotesList"
import SignInButton from "./SignInButton"

export default function HomeContent() {
  const { data: session, status } = useSession()
  const [notes, setNotes] = useState([])

  useEffect(() => {
    if (session?.user?.id) {
      fetch("/api/notes")
        .then((res) => res.json())
        .then((data) => setNotes(data))
        .catch((error) => console.error("Failed to fetch notes:", error))
    }
  }, [session])

  if (status === "loading") {
    return <div>Loading...</div>
  }

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-white">
            Welcome to Notesapp
          </h1>
          <p className="mb-4 text-gray-300">
            Please sign in to access your notes.
          </p>
          <SignInButton />
        </div>
      </div>
    )
  }

  return <NotesList notes={notes} userId={session.user.id} />
}
