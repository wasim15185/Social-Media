"use client"

import { useEffect, useState } from "react"
import {
  Home,
  MessageCircle,
  UsersRound,
  LogOut,
  Search,
  Sun,
  Moon,
  Bell,
} from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/navbar/theme-toggle"
import { useAuthStore } from "@/store/auth-store"
import { useNotificationStore } from "@/store/notification"
import SearchNav from "./search-nav"
import { socket } from "@/lib/socket"
import { NotificationBell } from "@/components/notification/notification-bell"
import { useNotifications } from "@/hooks/use-notifications"
import { cn } from "@/lib/utils/utils"

const NAV_LINKS = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/messages", label: "Messages", icon: MessageCircle },
  { href: "/friends", label: "Friends", icon: UsersRound },
]

export function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, logout } = useAuthStore()
  const addNotification = useNotificationStore((s) => s.addNotification)
  const [scrolled, setScrolled] = useState(false)
 
  useNotifications()

  useEffect(() => {
    if (!user?.id) return
    if (!socket.connected) socket.connect()
    socket.emit("join-user", user.id)
    return () => {
      socket.off("notification")
    }
  }, [user?.id])

  useEffect(() => {
    const handleNotification = (data: any) => addNotification(data)
    socket.on("notification", handleNotification)
    return () => {
      socket.off("notification", handleNotification)
    }
  }, [addNotification])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    socket.disconnect()
    logout()
    router.replace("/login")
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 w-full border-b transition-all duration-200",
        scrolled
          ? "border-border/80 bg-background/90 backdrop-blur-md"
          : "border-border bg-background"
      )}
    >
      <div className="mx-auto flex h-14 max-w-[1200px] items-center px-4">
        {/* LEFT — brand */}
        <div className="flex min-w-[160px] items-center">
          <Link href="/feed" className="group flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary transition-transform group-hover:scale-125" />
            <span className="text-[15px] font-medium tracking-tight">
              SocialApp
            </span>
          </Link>
        </div>

        {/* CENTER — nav links */}
        <nav className="flex flex-1 items-center justify-center gap-1">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href || pathname.startsWith(href + "/")
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative flex flex-col items-center gap-[3px] rounded-lg px-5 py-[6px] text-[11px] transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                )}
              >
                <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                <span className={cn("font-normal", isActive && "font-medium")}>
                  {label}
                </span>
                {/* active pip */}
                {isActive && (
                  <span className="absolute bottom-[3px] left-1/2 h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-primary" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* RIGHT — actions */}
        <div className="flex min-w-[160px] items-center justify-end gap-1">
          <SearchNav />
          <ThemeToggle />
          <NotificationBell />

          {/* divider */}
          <span className="mx-1 h-5 w-px bg-border" />

          {/* avatar */}
          <Link href={`/${user?.id}`}>
            <Avatar className="h-8 w-8 cursor-pointer ring-1 ring-border transition-all hover:ring-primary">
              <AvatarImage src={user?.profileImage || "/avatar.png"} />
              <AvatarFallback className="text-xs font-medium">
                {user?.username?.slice(0, 2).toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <LogOut size={16} />
          </Button>
        </div>
      </div>
    </header>
  )
}
