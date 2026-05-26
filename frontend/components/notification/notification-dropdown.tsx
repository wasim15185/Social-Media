"use client"

import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/network/api-client"
import { useNotificationStore } from "@/store/notification"

export const NotificationDropdown = () => {
  const router = useRouter()

  const notifications = useNotificationStore((s) => s.notifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)

  /**
   * Handle click on notification
   */
  const handleClick = async (n: any) => {
    try {
      // mark as read in backend
      await apiClient.patch(`/users/notifications/${n.id}/read`)

      // update local state
      markAsRead(n.id)

      // navigation logic
      if (n.type === "FOLLOW") {
        router.push(`/profile/${n.sender.username}`)
      } else if (n.post?.id) {
        router.push(`/post/${n.post.id}`)
      }
    } catch (err) {
      console.error("Notification error:", err)
    }
  }

  return (
    <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border bg-background p-2 shadow-lg">
      {/* Empty State */}
      {notifications.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No notifications
        </p>
      )}

      {/* Notification List */}
      <div className="flex max-h-96 flex-col gap-1 overflow-y-auto">
        {notifications.map((n) => (
          <div
            key={n.id}
            onClick={() => handleClick(n)}
            className="flex cursor-pointer items-start gap-3 rounded-lg p-2 transition hover:bg-muted"
          >
            {/* Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-sm font-semibold">
              {n.sender?.username?.[0]?.toUpperCase() || "U"}
            </div>

            {/* Content */}
            <div className="flex-1 text-sm">
              {n.type === "LIKE" && (
                <p>
                  <span className="font-medium">{n.sender.username}</span> liked
                  your post ❤️
                </p>
              )}

              {n.type === "COMMENT" && (
                <p>
                  <span className="font-medium">{n.sender.username}</span>{" "}
                  commented on your post 💬
                </p>
              )}

              {n.type === "FOLLOW" && (
                <p>
                  <span className="font-medium">{n.sender.username}</span>{" "}
                  started following you 👤
                </p>
              )}
            </div>

            {/* Unread Indicator */}
            {!n.isRead && (
              <div className="mt-2 h-2 w-2 rounded-full bg-blue-500" />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
