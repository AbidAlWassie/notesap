// components/Notes.tsx
"use client"

import { Loader2, Plus, Trash } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

interface Note {
  id: string
  title: string
  content: string
  created_at: number
  updated_at: number
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
      setNotes(data)
    } catch (error) {
      console.error("Failed to fetch notes:", error)
      setError("Failed to fetch notes. Please try again.")
    }
    setIsLoading(false)
  }

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
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
            body: JSON.stringify({ title, content }),
          })
        : await fetch("/api/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content }),
          })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchNotes()
      setSelectedNote(null)
      setTitle("")
      setContent("")
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
      setContent("")
    } catch (error) {
      console.error("Failed to delete note:", error)
      setError("Failed to delete note. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex h-full p-4">
      <Card className="mr-4 w-1/3 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-100" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <ul className="space-y-2">
              {notes.length === 0 ? (
                <li className="text-sm text-slate-400">
                  No notes found. Create a new one!
                </li>
              ) : (
                notes.map((note) => (
                  <li key={note.id}>
                    <Button
                      variant={
                        selectedNote?.id === note.id ? "secondary" : "ghost"
                      }
                      className="w-full justify-start text-left text-slate-100"
                      onClick={() => {
                        setSelectedNote(note)
                        setTitle(note.title)
                        setContent(note.content)
                      }}
                    >
                      <span className="truncate">{note.title}</span>
                    </Button>
                  </li>
                ))
              )}
            </ul>
          )}
          <Button
            onClick={() => {
              setSelectedNote(null)
              setTitle("")
              setContent("")
            }}
            className="mt-4 w-full bg-indigo-600 text-indigo-50 hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
        </CardContent>
      </Card>
      <Card className="w-2/3 bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-100">
            {selectedNote ? "Edit Note" : "New Note"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="mb-4 bg-slate-700 text-slate-100"
          />
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Content"
            className="mb-4 h-64 bg-slate-700 text-slate-100"
          />
          <div className="flex justify-between">
            <Button
              onClick={handleSave}
              disabled={isLoading || !title.trim() || !content.trim()}
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
            {selectedNote && (
              <Button
                onClick={() => handleDelete(selectedNote.id)}
                variant="destructive"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="mr-2 h-4 w-4" />
                )}
                Delete
              </Button>
            )}
          </div>
          {error && <p className="mt-4 text-sm text-red-500">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
