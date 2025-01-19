"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function Navbar() {
  const { data: session, status } = useSession()
  const router = useRouter()

  return (
    <nav className="flex items-center justify-between bg-slate-800 px-6 py-4">
      <Link
        href="/"
        className="text-2xl font-bold text-indigo-400 hover:text-indigo-300"
      >
        📒 Notesapp
      </Link>
      {status === "authenticated" && session?.user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={session.user.image || ""}
                  alt={session.user.name || "User"}
                />
                <AvatarFallback>
                  {session.user.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 border-gray-600 bg-gray-800"
            align="end"
            forceMount
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={() => router.push("/profile")}
              className="cursor-pointer py-2 text-gray-200"
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="cursor-pointer py-2 text-gray-200"
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-700" />
            <DropdownMenuItem
              onClick={() => router.push("/api/auth/signout")}
              className="cursor-pointer py-2 text-gray-200"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  )
}
