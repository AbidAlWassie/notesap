"use server"

import { createNote, deleteNote, updateNote } from "@/lib/user-notes"
import { revalidatePath } from "next/cache"

export async function createNoteAction(
  userId: string,
  title: string,
  content: string,
) {
  await createNote(userId, title, content)
  revalidatePath("/")
}

export async function updateNoteAction(
  userId: string,
  id: string,
  title: string,
  content: string,
) {
  await updateNote(userId, id, title, content)
  revalidatePath("/")
}

export async function deleteNoteAction(userId: string, id: string) {
  await deleteNote(userId, id)
  revalidatePath("/")
}
