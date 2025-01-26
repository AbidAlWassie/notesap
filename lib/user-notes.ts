// lib/user-notes.ts
import crypto from "crypto"
import { createUserDatabase, getUserClient } from "./turso"

export async function initializeUserDatabase(userId: string) {
  try {
    console.log(`Checking/Initializing database for user: ${userId}`)
    const result = await createUserDatabase(userId)

    if (result.success) {
      const client = getUserClient(userId)
      await client.execute(`
        CREATE TABLE IF NOT EXISTS notes (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          content TEXT NOT NULL,
          created_at INTEGER NOT NULL,
          updated_at INTEGER NOT NULL
        )
      `)
      console.log(`User database checked/initialized for: ${userId}`)
    }
  } catch (error) {
    console.error("Error checking/initializing user database:", error)
    // Don't throw the error to avoid breaking the auth flow
  }
}

export async function createNote(
  userId: string,
  title: string,
  content: string,
) {
  const client = getUserClient(userId)
  const id = crypto.randomUUID()
  const now = Date.now()

  try {
    await client.execute({
      sql: `INSERT INTO notes (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
      args: [id, title, content, now, now],
    })
    return id
  } catch (error) {
    console.error("Error creating note:", error)
    throw error
  }
}

export async function getNotes(userId: string) {
  const client = getUserClient(userId)
  const result = await client.execute(
    "SELECT * FROM notes ORDER BY updated_at DESC",
  )

  // Convert the result to plain objects and ensure dates are strings
  return result.rows.map((note) => ({
    id: String(note.id),
    title: String(note.title),
    content: String(note.content),
    created_at: note.created_at
      ? new Date(Number(note.created_at)).toISOString()
      : null,
    updated_at: note.updated_at
      ? new Date(Number(note.updated_at)).toISOString()
      : null,
  }))
}

export async function getNoteById(userId: string, noteId: string) {
  const client = getUserClient(userId)
  const result = await client.execute({
    sql: "SELECT * FROM notes WHERE id = ?",
    args: [noteId],
  })

  if (result.rows.length === 0) {
    return null
  }

  const note = result.rows[0]
  return {
    id: note.id as string,
    title: note.title as string,
    content: note.content as string,
    created_at: note.created_at as number,
    updated_at: note.updated_at as number,
  }
}

export async function updateNote(
  userId: string,
  id: string,
  title: string,
  content: string,
) {
  const client = getUserClient(userId)
  const timestamp = Date.now()
  try {
    await client.execute({
      sql: `UPDATE notes SET title = ?, content = ?, updated_at = ? WHERE id = ?`,
      args: [title, content, timestamp, id],
    })
    return { success: true }
  } catch (error) {
    console.error("Error updating note:", error)
    throw error
  }
}

export async function deleteNote(userId: string, id: string) {
  const client = getUserClient(userId)
  try {
    await client.execute({
      sql: `DELETE FROM notes WHERE id = ?`,
      args: [id],
    })
    return { success: true }
  } catch (error) {
    console.error("Error deleting note:", error)
    throw error
  }
}
