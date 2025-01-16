"use server";

import { auth } from "@/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getNotes() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  return prisma.note.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.note.create({
    data: {
      title,
      content,
      userId: session.user.id,
    },
  });

  revalidatePath("/");
}

export async function updateNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;

  await prisma.note.update({
    where: { id, userId: session.user.id },
    data: { title, content },
  });

  revalidatePath("/");
}

export async function deleteNote(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const id = formData.get("id") as string;

  await prisma.note.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/");
}
