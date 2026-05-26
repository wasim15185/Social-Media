"use client"

import { useEffect, useState } from "react"
import { Home, MessageCircle, LogOut, UsersRound } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { ThemeToggle } from "@/components/navbar/theme-toggle"
import { useAuthStore } from "@/store/auth-store"
import { useNotificationStore } from "@/store/notification"
import SearchNav from "./search-nav"
import { socket } from "@/lib/socket"

// ✅ Notification
import { NotificationBell } from "@/components/notification/notification-bell"
import { useNotifications } from "@/hooks/use-notifications"

export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const addNotification = useNotificationStore((s) => s.addNotification)

  const [scrolled, setScrolled] = useState(false)

  /**
   * ✅ Fetch notifications (initial load)
   */
  useNotifications()

  /**
   * ✅ Socket Connection + Join Room
   */
  useEffect(() => {
    if (!user?.id) return

    if (!socket.connected) {
      socket.connect()
    }

    socket.emit("join-user", user.id)

    return () => {
      socket.off("notification")
    }
  }, [user?.id])

  /**
   * ✅ Listen for real-time notifications
   */
  useEffect(() => {
    const handleNotification = (data: any) => {
      addNotification(data)
    }

    socket.on("notification", handleNotification)

    return () => {
      socket.off("notification", handleNotification)
    }
  }, [addNotification])

  /**
   * ✅ Scroll shadow effect
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  /**
   * ✅ Logout
   */
  const handleLogout = () => {
    socket.disconnect() // important
    logout()
    router.replace("/login")
  }

  return (
    <header
      className={`sticky top-0 z-50 h-14 w-full border-b transition-all duration-300 ${
        scrolled ? "shadow" : "shadow-none"
      }`}
    >
      <div
        className={`relative ${
          scrolled
            ? "after:absolute after:inset-0 after:-z-10 after:bg-background/90 after:backdrop-blur-lg"
            : ""
        }`}
      >
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link href="/feed" className="text-lg font-bold">
              SocialApp
            </Link>
          </div>

          {/* CENTER */}
          <nav className="flex items-center gap-16">
            {/* Home */}
            <Link className="flex flex-col items-center text-xs" href="/feed">
              <Home size={18} />
              <span className="mt-[1px] font-medium">Home</span>
            </Link>

            {/* Messages */}
            <Link
              className="flex flex-col items-center text-xs"
              href="/messages"
            >
              <MessageCircle size={18} />
              <span className="mt-[1px] font-medium">Messages</span>
            </Link>

            {/* Friends */}
            <Link
              className="flex flex-col items-center text-xs"
              href="/friends"
            >
              <UsersRound size={18} />
              <span className="mt-[1px] font-medium">Friends</span>
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <SearchNav />

            <ThemeToggle />

            {/* 🔔 Notifications */}
            <NotificationBell />

            {/* Profile */}
            <Link href={`/profile/${user?.username}`}>
              <Avatar className="h-8 w-8 cursor-pointer">
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
      </div>
    </header>
  )
}
