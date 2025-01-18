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
  try {
    const { rows } = await client.execute({
      sql: `SELECT * FROM notes ORDER BY created_at DESC`,
      args: [],
    })
    return rows
  } catch (error) {
    console.error("Error fetching notes:", error)
    throw error
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
