// components/NoteEditor.tsx
"use client"

import {
  createNoteAction,
  deleteNoteAction,
  updateNoteAction,
} from "@/app/actions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import { useCallback, useEffect, useState } from "react"
import "./../styles/editor.css"
import Editor from "./Editor"

interface Note {
  id: string
  title: string
  content: string
}

const STORAGE_KEY = "unsaved_note"

export default function NoteEditor({
  userId,
  initialNote,
}: {
  userId: string
  initialNote?: Note
}) {
  const [title, setTitle] = useState(initialNote?.title || "")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== "undefined" ? navigator.onLine : true,
  )
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const saveToLocalStorage = useCallback(
    (title: string, content: string) => {
      if (!initialNote) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ title, content }))
      }
    },
    [initialNote],
  )

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
    onUpdate: ({ editor }) => {
      saveToLocalStorage(title, editor.getHTML())
    },
  })

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  useEffect(() => {
    if (!initialNote) {
      const savedNote = loadFromLocalStorage()
      if (savedNote) {
        setTitle(savedNote.title)
        editor?.commands.setContent(savedNote.content)
      }
    }
  }, [initialNote, editor])

  useEffect(() => {
    if (editor) {
      saveToLocalStorage(title, editor.getHTML())
    }
  }, [title, editor, saveToLocalStorage])

  const handleSave = useCallback(async () => {
    if (!title.trim() || !editor?.getHTML()) {
      setError("Title and content are required")
      return
    }

    setIsSaving(true)
    setError(null)
    try {
      if (initialNote) {
        await updateNoteAction(userId, initialNote.id, title, editor.getHTML())
      } else {
        await createNoteAction(userId, title, editor.getHTML())
      }
      clearLocalStorage()
      router.push("/")
    } catch (error) {
      console.error("Failed to save note:", error)
      setError("Failed to save note. Please try again.")
    }
    setIsSaving(false)
  }, [title, editor, userId, initialNote, router])

  const loadFromLocalStorage = () => {
    const savedNote = localStorage.getItem(STORAGE_KEY)
    return savedNote ? JSON.parse(savedNote) : null
  }

  const clearLocalStorage = () => {
    localStorage.removeItem(STORAGE_KEY)
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
              onClick={() => {
                clearLocalStorage()
                router.push("/")
              }}
              className="bg-slate-600 text-indigo-100 hover:bg-slate-700 hover:text-indigo-50"
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              {initialNote && (
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="bg-red-600 text-red-50 hover:bg-red-700"
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="border-indigo-700 bg-indigo-900 text-indigo-100 sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription className="text-indigo-300">
                        Are you sure you want to delete this note? This action
                        cannot be undone.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button
                        variant="ghost"
                        onClick={() => setIsDeleteDialogOpen(false)}
                        className="bg-slate-600 text-indigo-100 hover:bg-slate-700 hover:text-indigo-50"
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setIsDeleteDialogOpen(false)
                          handleDelete()
                        }}
                        className="bg-red-600 text-red-50 hover:bg-red-700"
                      >
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
              <Button
                onClick={handleSave}
                disabled={isSaving || !title.trim()}
                className="bg-indigo-600 text-indigo-50 hover:bg-indigo-700"
              >
                {isSaving ? (
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
