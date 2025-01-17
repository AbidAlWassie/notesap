// app/page.tsx
import UI from "./ui"

export default function Home() {
  return <UI />
}

export type SearchParams = { [key: string]: string | string[] | undefined }

export interface PageProps {
  params: Promise<{ [key: string]: string }>
  searchParams: Promise<SearchParams>
}
