"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function Notes() {
  const { data: session } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (session) {
      fetchNotes();
    }
  }, [session]);

  const fetchNotes = async () => {
    const response = await fetch("/api/notes");
    const data = await response.json();
    setNotes(data);
  };

  const handleSave = async () => {
    if (selectedNote) {
      // Update existing note
      await fetch(`/api/notes/${selectedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    } else {
      // Create new note
      await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }
    fetchNotes();
    setSelectedNote(null);
    setTitle("");
    setContent("");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  return (
    <div className="flex h-full">
      <div className="w-1/3 p-4 border-r border-gray-700">
        <h2 className="text-xl font-bold mb-4">Notes</h2>
        <ul>
          {notes.map((note) => (
            <li
              key={note.id}
              className="mb-2 p-2 bg-gray-700 rounded cursor-pointer"
              onClick={() => {
                setSelectedNote(note);
                setTitle(note.title);
                setContent(note.content);
              }}
            >
              {note.title}
            </li>
          ))}
        </ul>
        <Button
          onClick={() => {
            setSelectedNote(null);
            setTitle("");
            setContent("");
          }}
          className="mt-4"
        >
          New Note
        </Button>
      </div>
      <div className="w-2/3 p-4">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="mb-4"
        />
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
          className="mb-4 h-64"
        />
        <Button onClick={handleSave}>Save</Button>
        {selectedNote && (
          <Button
            onClick={() => handleDelete(selectedNote.id)}
            className="ml-2 bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
