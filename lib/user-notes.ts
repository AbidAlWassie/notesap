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
  const { rows } = await tursoClient.execute({
    sql: `SELECT * FROM notes_${userId} ORDER BY updated_at DESC`,
    args: [],
  });
  return rows;
}

export async function updateNote(userId: string, id: string, title: string, content: string) {
  const now = Date.now();
  await tursoClient.execute({
    sql: `UPDATE notes_${userId} SET title = ?, content = ?, updated_at = ? WHERE id = ?`,
    args: [title, content, now, id],
  });
}

export async function deleteNote(userId: string, id: string) {
  await tursoClient.execute({
    sql: `DELETE FROM notes_${userId} WHERE id = ?`,
    args: [id],
  });
}
