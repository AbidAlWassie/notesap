// lib/turso.ts
import { createClient } from "@libsql/client"

export const parentClient = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
})

export function getUserClient(userId: string) {
  return createClient({
    url: `${process.env.TURSO_DATABASE_URL!.replace("parent-db", `user-${userId}`)}`,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  })
}

export async function createUserDatabase(userId: string) {
  try {
    const tursoOrgId = process.env.TURSO_ORG_ID
    if (!tursoOrgId) {
      throw new Error("TURSO_ORG_ID is not set in environment variables")
    }

    const response = await fetch(
      `https://api.turso.tech/v1/organizations/${tursoOrgId}/databases`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.TURSO_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `user-${userId}`,
          group: "notesap",
          location: "hkg",
          image: "latest",
          from_parent: "parent-db",
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`Failed to create database: ${error.message}`)
    }

    console.log(`Database created successfully for user: ${userId}`)
    // Wait for the database to be ready
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return await response.json()
  } catch (error) {
    console.error("Error creating user database:", error)
    throw error
  }
}
