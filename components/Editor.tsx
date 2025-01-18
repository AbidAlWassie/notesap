// components/Editor.tsx
"use client"
import { Editor as TiptapEditor } from "@tiptap/core"
import { EditorContent } from "@tiptap/react"
import Toolbar from "./Toolbar"

interface EditorProps {
  editor: TiptapEditor | null
}

const Editor = ({ editor }: EditorProps) => {
  if (!editor) return null

  return (
    <div className="editor-container">
      <Toolbar editor={editor} />
      <div className="min-h-[300px] bg-gray-800/30 p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default Editor
