// components/Notes.tsx
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Loader2, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import "./../styles/editor.css"
import Editor from "./Editor"

interface Note {
  id: string
  title: string
  content: string
  created_at: number
  updated_at: number
  color?: string
}

const noteColors = [
  "bg-purple-400/20",
  "bg-pink-400/20",
  "bg-green-400/20",
  "bg-orange-400/20",
  "bg-blue-400/20",
  "bg-yellow-400/20",
]

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content: "",
  })

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/notes", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const notesWithColors = data.map((note: Note) => ({
        ...note,
        color:
          note.color ||
          noteColors[Math.floor(Math.random() * noteColors.length)],
      }))
      setNotes(notesWithColors)
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      setError("Failed to fetch notes. Please try again.")
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!title.trim() || !editor?.getHTML()) {
      setError("Title and content are required")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      const response = selectedNote
        ? await fetch(`/api/notes/${selectedNote.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content: editor.getHTML(),
              color: selectedNote.color,
            }),
          })
        : await fetch("/api/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title,
              content: editor.getHTML(),
              color: noteColors[Math.floor(Math.random() * noteColors.length)],
            }),
          })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchNotes()
      setSelectedNote(null)
      setTitle("")
      editor?.commands.setContent("")
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to save note:", error)
      setError("Failed to save note. Please try again.")
    }
    setIsLoading(false)
  }

  const handleDelete = async (id: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      await fetchNotes()
      setSelectedNote(null)
      setTitle("")
      editor?.commands.setContent("")
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to delete note:", error)
      setError("Failed to delete note. Please try again.")
    }
    setIsLoading(false)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-indigo-950 p-4">
      <div className="mx-auto max-w-7xl">
        {isEditing ? (
          <Card className="border-indigo-800 bg-indigo-900/50 p-4">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note title..."
              className="mb-4 border-indigo-800 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400"
            />
            <div className="mb-4 rounded-lg border border-indigo-800 bg-indigo-900/50">
              <Editor editor={editor} />
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => setIsEditing(false)}
                  className="text-indigo-100 hover:bg-indigo-800 hover:text-indigo-50"
                >
                  Cancel
                </Button>
                {selectedNote && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDelete(selectedNote.id)
                    }}
                    className="bg-red-600 text-red-50 hover:bg-red-700"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                )}
              </div>
              <Button
                onClick={handleSave}
                disabled={isLoading || !title.trim()}
                className="bg-indigo-600 text-indigo-50 hover:bg-indigo-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {notes.map((note) => (
              <Card
                key={note.id}
                className={cn(
                  "group relative cursor-pointer border-0 p-4 transition-all hover:scale-105",
                  note.color,
                )}
                onClick={() => {
                  setSelectedNote(note)
                  setTitle(note.title)
                  editor?.commands.setContent(note.content)
                  setIsEditing(true)
                }}
              >
                <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-indigo-100">
                  {note.title}
                </h3>
                <div
                  className="line-clamp-4 text-sm text-indigo-200"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </Card>
            ))}
          </div>
        )}
      </div>
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 p-0 text-indigo-50 shadow-lg hover:bg-indigo-700"
        onClick={() => {
          setSelectedNote(null)
          setTitle("")
          editor?.commands.setContent("")
          setIsEditing(true)
        }}
      >
        <Plus className="h-6 w-6" />
      </Button>
    </div>
  )
}
