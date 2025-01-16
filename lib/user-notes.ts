// lib/user-notes.ts
import { tursoClient } from "./turso";

export async function initializeUserNotesTable(userId: string) {
  await tursoClient.execute(`
    CREATE TABLE IF NOT EXISTS notes_${userId} (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);
}

export async function createNote(userId: string, title: string, content: string) {
  const id = crypto.randomUUID();
  const now = Date.now();
  await tursoClient.execute({
    sql: `INSERT INTO notes_${userId} (id, title, content, created_at, updated_at) VALUES (?, ?, ?, ?, ?)`,
    args: [id, title, content, now, now],
  });
  return id;
}

export async function getNotes(userId: string) {
  try {
    const { rows } = await tursoClient.execute({
      sql: `SELECT * FROM notes_${userId} ORDER BY created_at DESC`,
      args: [],
    });
    return rows;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
}

export async function updateNote(userId: string, id: string, title: string, content: string) {
  const timestamp = Date.now();
  try {
    await tursoClient.execute({
      sql: `UPDATE notes_${userId} SET title = ?, content = ?, updated_at = ? WHERE id = ?`,
      args: [title, content, timestamp, id],
    });
    return { success: true };
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
}

export async function deleteNote(userId: string, id: string) {
  try {
    await tursoClient.execute({
      sql: `DELETE FROM notes_${userId} WHERE id = ?`,
      args: [id],
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
}

