// app/page.tsx
import { auth } from "@/auth"
import { SessionProvider } from "@/components/providers/SessionProvider"
import UI from "./ui"

export default async function Home() {
  const session = await auth()
  return (
    <SessionProvider session={session}>
      <UI />
    </SessionProvider>
  )
}

export type SearchParams = { [key: string]: string | string[] | undefined }

export interface PageProps {
  params: Promise<{ [key: string]: string }>
  searchParams: Promise<SearchParams>
}
