"use client"

import { useEffect, useState } from "react"
import { Home, Bell, MessageCircle, Search, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

import { ThemeToggle } from "@/components/navbar/theme-toggle"
import { useAuthStore } from "@/store/auth-store"
import SearchNav from "./search-nav"






export function Navbar() {
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const [scrolled, setScrolled] = useState(false)

  /**
   * Detect scroll
   */
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
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
        {/* ✅ CENTERED CONTAINER (IMPORTANT) */}
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link href="/feed" className="text-lg font-bold">
              SocialApp
            </Link>
          </div>

          {/* CENTER */}
          <nav className="flex items-center gap-8">
            <Link className="flex flex-col items-center text-xs" href="/feed">
              <Home size={16} />
              <span className="font-medium">Home</span>
            </Link>

            <Link
              className="flex flex-col items-center text-xs"
              href="/messages"
            >
              <MessageCircle size={16} />
              <span className="font-medium">Messages</span>
            </Link>

            <Link
              className="flex flex-col items-center text-xs"
              href="/notifications"
            >
              <Bell size={16} />
              <span className="font-medium">Notifications</span>
            </Link>
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <SearchNav />

            <ThemeToggle />

            <Link href={`/profile/${user?.username}`}>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={user?.profileImage || "/avatar.png"} />
                <AvatarFallback>
                  {user?.username?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Link>

            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut size={18} />
            </Button>
          </div>
        </div>
      </div>
    </header>

    // <header
    //   className={`sticky top-0 z-50 h-16 w-full border-b transition-all duration-300 ${
    //     scrolled ? "shadow" : "shadow-none"
    //   }`}
    // >
    //   <div
    //     className={`relative flex h-full  items-center justify-between gap-4 px-6 ${
    //       scrolled
    //         ? "after:absolute after:inset-0 after:-z-10 after:bg-background/90 after:backdrop-blur-lg"
    //         : ""
    //     }`}
    //   >
    //     {/* LEFT */}
    //     <div className="flex items-center gap-4">
    //       <Link href="/feed" className="text-lg font-bold">
    //         SocialApp
    //       </Link>

    //       {/* <div className="relative hidden md:block">
    //         <Search className="absolute top-2.5 left-3 h-4 w-4 text-muted-foreground" />

    //         <Input
    //           placeholder="Search..."
    //           className="w-64 rounded-full bg-muted/60 pl-9"
    //         />
    //       </div> */}
    //     </div>

    //     {/* CENTER */}
    //     <nav className="flex items-center gap-8">
    //       <Link className="flex flex-col items-center text-xs" href="/feed">
    //         <Home size={20} />
    //         Home
    //       </Link>

    //       <Link className="flex flex-col items-center text-xs" href="/messages">
    //         <MessageCircle size={20} />
    //         Messages
    //       </Link>

    //       <Link
    //         className="flex flex-col items-center text-xs"
    //         href="/notifications"
    //       >
    //         <Bell size={20} />
    //         Notifications
    //       </Link>
    //     </nav>

    //     {/* RIGHT */}
    //     <div className="flex items-center gap-3">
    //       <ThemeToggle />

    //       <Link href={`/profile/${user?.username}`}>
    //         <Avatar className="h-9 w-9 cursor-pointer">
    //           <AvatarImage src={user?.profileImage || "/avatar.png"} />
    //           <AvatarFallback>
    //             {user?.username?.slice(0, 2).toUpperCase() || "U"}
    //           </AvatarFallback>
    //         </Avatar>
    //       </Link>

    //       <Button variant="ghost" size="icon" onClick={handleLogout}>
    //         <LogOut size={18} />
    //       </Button>
    //     </div>
    //   </div>
    // </header>
  )
}
