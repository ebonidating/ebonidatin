"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export function HeaderClient() {
  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/eboni-logo.png"
            alt="Eboni Dating Logo"
            width={40}
            height={40}
            className="rounded-full"
            priority
          />
          <h1 className="text-xl sm:text-2xl font-bold text-primary">Eboni Dating</h1>
        </div>
        <nav className="hidden md:flex gap-6 items-center">
          <Link href="/auth/login" className="text-foreground/60 hover:text-foreground transition">
            Login
          </Link>
          <Link href="/auth/sign-up" className="text-foreground/60 hover:text-foreground transition">
            Sign Up
          </Link>
          <ThemeToggle />
        </nav>
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Link href="/auth/login">
            <Button size="sm" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
