"use client"

import { useChatStore } from "@/store/chat-store"
import { useAuthStore } from "@/store/auth-store"
import { Conversation } from "@/lib/network/chat-api"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/utils"
import { formatDistanceToNow } from "date-fns"
import { Loader2 } from "lucide-react"

function getOtherParticipant(conv: Conversation, myId: number) {
  return conv.participants.find((p) => p.userId !== myId)
}

function getUnreadCount(conv: Conversation, myId: number) {
  const me = conv.participants.find((p) => p.userId === myId)
  return me?.unreadCount ?? 0
}

export function ConversationList() {
  const { user } = useAuthStore()
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    loadingConversations,
  } = useChatStore()

  if (loadingConversations) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!conversations.length) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center">
        <p className="text-sm font-medium text-muted-foreground">
          No conversations yet
        </p>
        <p className="text-xs text-muted-foreground">
          Go to a profile and start a chat.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col">
      {conversations.map((conv) => {
        const other = getOtherParticipant(conv, user!.id)
        const unread = getUnreadCount(conv, user!.id)
        const lastMsg = conv.messages[0]
        const isActive = conv.id === activeConversationId

        return (
          <li key={conv.id}>
            <button
              onClick={() => setActiveConversation(conv.id)}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/60",
                isActive && "bg-muted"
              )}
            >
              <Avatar className="h-10 w-10 shrink-0">
                <AvatarImage src={other?.user.profileImage || "/avatar.png"} />
                <AvatarFallback>
                  {other?.user.username?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-sm font-semibold">
                    {other?.user.username || "Unknown"}
                  </span>
                  {lastMsg && (
                    <span className="shrink-0 text-[11px] text-muted-foreground">
                      {formatDistanceToNow(new Date(lastMsg.createdAt), {
                        addSuffix: false,
                      })}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-xs text-muted-foreground">
                    {lastMsg?.text ||
                      (lastMsg?.mediaType ? "📎 Media" : "No messages yet")}
                  </p>
                  {unread > 0 && (
                    <span className="flex h-4 min-w-4 shrink-0 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                      {unread > 99 ? "99+" : unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
