"use client"

import { Home, Bell, MessageCircle, Search, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { ThemeToggle } from "@/components/navbar/theme-toggle"

import { useAuthStore } from "@/store/auth-store"

export function Navbar() {
  const router = useRouter()

  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    router.replace("/login")
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        {/* LEFT: Logo + Search */}

        <div className="flex items-center gap-4">
          <Link href="/feed" className="text-xl font-bold">
            SocialApp
          </Link>

          <div className="relative hidden md:block">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />

            <Input placeholder="Search..." className="w-64 pl-9" />
          </div>
        </div>

        {/* CENTER: Navigation */}

        <nav className="flex items-center gap-8">
          <Link href="/feed" className="flex flex-col items-center text-sm">
            <Home size={20} />
            Home
          </Link>

          <Link href="/messages" className="flex flex-col items-center text-sm">
            <MessageCircle size={20} />
            Messages
          </Link>

          <Link
            href="/notifications"
            className="flex flex-col items-center text-sm"
          >
            <Bell size={20} />
            Notifications
          </Link>
        </nav>

        {/* RIGHT: Theme + Profile + Logout */}

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}

          <ThemeToggle />

          {/* Profile */}

          <Link href={`/profile/${user?.username}`}>
            <Avatar className="cursor-pointer">
              <AvatarImage src={user?.profileImage || "/avatar.png"} />

              <AvatarFallback>
                {user?.username?.slice(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Logout */}

          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut size={18} />
          </Button>
        </div>
      </div>

      
    </header>
  )
}





/*


<Avatar className="cursor-pointer">
            <AvatarImage src="/avatar.png" />

            <AvatarFallback>WA</AvatarFallback>
          </Avatar>


*/
