"use client"

import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Color from "@tiptap/extension-color"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Loader2, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import "./../styles/editor.css"
import Editor from "./Editor"

interface Note {
  id: string
  title: string
  content: string
}

export default function NoteEditor({
  userId,
  initialNote,
}: {
  userId: string
  initialNote?: Note
}) {
  const [title, setTitle] = useState(initialNote?.title || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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
    content: initialNote?.content || "",
    editable: true,
    immediatelyRender: false,
  })

  const handleSave = async () => {
    if (!title.trim() || !editor?.getHTML()) {
      setError("Title and content are required")
      return
    }

    setIsLoading(true)
    setError(null)
    try {
      if (initialNote) {
        await updateNoteAction(userId, initialNote.id, title, editor.getHTML())
      } else {
        await createNoteAction(userId, title, editor.getHTML())
      }
      router.push("/")
    } catch (error) {
      console.error("Failed to save note:", error)
      setError("Failed to save note. Please try again.")
    }
    setIsLoading(false)
  }

  const handleDelete = async () => {
    if (!initialNote) return

    setIsLoading(true)
    setError(null)
    try {
      await deleteNoteAction(userId, initialNote.id)
      router.push("/")
    } catch (error) {
      console.error("Failed to delete note:", error)
      setError("Failed to delete note. Please try again.")
    }
    setIsLoading(false)
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
      <div className="mx-auto max-w-3xl">
        <Card className="border-indigo-800 bg-indigo-900/50 p-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className="mb-4 border-indigo-800 bg-indigo-900/50 text-indigo-100 placeholder:text-indigo-400"
          />
          <div className="mb-4 rounded-lg border border-indigo-800 bg-indigo-900/50">
            {editor && <Editor editor={editor} />}
          </div>
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={() => router.push("/")}
              className="text-indigo-100 hover:bg-indigo-800 hover:text-indigo-50"
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {initialNote && (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  className="bg-red-600 text-red-50 hover:bg-red-700"
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              )}
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
          </div>
        </Card>
      </div>
    </div>
  )
}
