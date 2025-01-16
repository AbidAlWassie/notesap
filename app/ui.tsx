// app/ui.tsx
"use client";
import Footer from "@/components/layouts/Footer";
import { Navbar } from "@/components/layouts/Navbar";
import Notes from "@/components/Notes";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../components/ui/button";

export default function Home() {
  const { status } = useSession();

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Navbar />
      <div className="flex-grow">
        {status === "loading" && <p className="text-center py-8">Loading...</p>}

        {status === "unauthenticated" && (
          <div className="text-center py-8">
            <p className="mb-4">Please sign in to access your notes.</p>
            <Button
              asChild
              className="bg-indigo-600 text-indigo-50 hover:bg-indigo-700"
            >
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          </div>
        )}

        {status === "authenticated" && <Notes />}
      </div>
      <Footer />
    </div>
  );
}
