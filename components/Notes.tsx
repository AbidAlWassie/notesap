// components/Notes.tsx
"use client"

import { cn } from "@/lib/utils"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Loader2, Menu, Plus, Trash, X } from "lucide-react"
import { useEffect, useState } from "react"
import "./../styles/editor.css"
import Editor from "./Editor"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"

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
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

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

  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title)
      editor?.commands.setContent(selectedNote.content)
    } else {
      setTitle("")
      editor?.commands.setContent("")
    }
  }, [selectedNote, editor])

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
            body: JSON.stringify({ title, content: editor.getHTML() }),
          })
        : await fetch("/api/notes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, content: editor.getHTML() }),
          })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      await fetchNotes()
      setSelectedNote(null)
      setTitle("")
      editor?.commands.setContent("")
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
    } catch (error) {
      console.error("Failed to delete note:", error)
      setError("Failed to delete note. Please try again.")
    }
    setIsLoading(false)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col md:flex-row">
      {/* Mobile Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="hover: absolute left-4 top-4 bg-indigo-700 hover:bg-indigo-600 hover:text-indigo-50 md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <Card
        className={cn(
          "w-full border-0 border-gray-700 bg-gray-900/50 backdrop-blur-sm md:w-80 md:rounded-none md:border-r",
          isSidebarOpen ? "block" : "hidden md:block",
        )}
      >
        <CardHeader>
          <CardTitle className="text-gray-100">Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-gray-100" />
            </div>
          ) : error ? (
            <p className="text-sm text-red-500">{error}</p>
          ) : (
            <ul className="space-y-2">
              {notes.length === 0 ? (
                <li className="text-sm text-gray-400">
                  No notes found. Create a new one!
                </li>
              ) : (
                notes.map((note) => (
                  <li key={note.id}>
                    <Button
                      variant={
                        selectedNote?.id === note.id ? "secondary" : "ghost"
                      }
                      className="w-full justify-start bg-indigo-700 text-left text-gray-100 hover:bg-indigo-800 hover:text-gray-50"
                      onClick={() => {
                        setSelectedNote(note)
                        setIsSidebarOpen(false)
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
              setIsSidebarOpen(false)
            }}
            className="mt-4 w-full bg-purple-600 text-purple-50 hover:bg-purple-700"
          >
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="flex-1 p-4">
        <Card className="h-full border-0 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-gray-100">
              {selectedNote ? "Edit Note" : "New Note"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="mb-4 border-gray-700 bg-gray-800/50 text-gray-100"
            />
            <Editor editor={editor} />
            <div className="mt-4 flex justify-between">
              <Button
                onClick={handleSave}
                disabled={isLoading || !title.trim() || !editor?.getHTML()}
                className="bg-purple-600 text-purple-50 hover:bg-purple-700"
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
    </div>
  )
}
