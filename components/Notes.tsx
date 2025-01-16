// components/Notes.tsx
"use client";

import { Loader2, Plus, Trash } from 'lucide-react';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface Note {
  id: string;
  title: string;
  content: string;
}

export default function Notes() {
  const { status } = useSession();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated") {
      fetchNotes();
    }
  }, [status]);

  const fetchNotes = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/notes");
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error("Unauthorized. Please sign in again.");
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setNotes(data);
      } else {
        console.error("Received non-array data:", data);
        setNotes([]);
        setError("Received invalid data from server");
      }
    } catch (error) {
      console.error("Failed to fetch notes:", error);
      setError(error instanceof Error ? error.message : "Failed to fetch notes. Please try again later.");
      setNotes([]);
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = selectedNote
        ? await fetch(`/api/notes/${selectedNote.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
          })
        : await fetch("/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, content }),
          });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await fetchNotes();
      setSelectedNote(null);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to save note:", error);
      setError("Failed to save note. Please try again.");
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      await fetchNotes();
      setSelectedNote(null);
      setTitle("");
      setContent("");
    } catch (error) {
      console.error("Failed to delete note:", error);
      setError("Failed to delete note. Please try again.");
    }
    setIsLoading(false);
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Please sign in to access your notes.</div>;
  }

  return (
    <div className="flex h-full">
      <Card className="w-1/3 p-4 mr-4">
        <CardHeader>
          <CardTitle>Notes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <ul className="space-y-2">
              {notes.length === 0 ? (
                <li>No notes found. Create a new one!</li>
              ) : (
                notes.map((note) => (
                  <li key={note.id}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        setSelectedNote(note);
                        setTitle(note.title);
                        setContent(note.content);
                      }}
                    >
                      {note.title}
                    </Button>
                  </li>
                ))
              )}
            </ul>
          )}
          <Button
            onClick={() => {
              setSelectedNote(null);
              setTitle("");
              setContent("");
            }}
            className="mt-4 w-full"
          >
            <Plus className="mr-2 h-4 w-4" /> New Note
          </Button>
        </CardContent>
      </Card>
      <Card className="w-2/3 p-4">
        <CardHeader>
          <CardTitle>{selectedNote ? "Edit Note" : "New Note"}</CardTitle>
        </CardHeader>
        <CardContent>
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
          <div className="flex justify-between">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
            {selectedNote && (
              <Button
                onClick={() => handleDelete(selectedNote.id)}
                variant="destructive"
                disabled={isLoading}
              >
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            )}
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

