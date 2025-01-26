"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Note {
  id: string
  title: string
  content: string
  created_at: string | null
  updated_at: string | null
}

const noteColors = [
  "bg-purple-400/20",
  "bg-pink-400/20",
  "bg-green-400/20",
  "bg-orange-400/20",
  "bg-blue-400/20",
  "bg-yellow-400/20",
]

type NotesListProps = {
  notes: Note[]
  userId: string
}

export default function NotesList({ notes }: NotesListProps) {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-indigo-950 p-4">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {notes.map((note, index) => (
            <Link href={`/note/${note.id}`} key={note.id}>
              <Card
                className={cn(
                  "group relative cursor-pointer border-0 p-4 transition-all hover:scale-105",
                  noteColors[index % noteColors.length],
                )}
              >
                <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-indigo-100">
                  {note.title}
                </h3>
                <div
                  className="line-clamp-4 text-sm text-indigo-200"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </Card>
            </Link>
          ))}
        </div>
      </div>
      <Link href="/note/new">
        <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 p-0 text-indigo-50 shadow-lg hover:bg-indigo-700">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </div>
  )
}
