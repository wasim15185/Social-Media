"use client"

import { Bell } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useNotificationStore } from "@/store/notification"
import { NotificationDropdown } from "./notification-dropdown"
import { Button } from "@/components/ui/button"

export const NotificationBell = () => {
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        title="Notifications"
        onClick={() => setOpen((prev) => !prev)}
        className="relative transition hover:bg-muted"
      >
        <Bell size={18} />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && <NotificationDropdown />}
    </div>
  )
}
