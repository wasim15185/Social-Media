"use client"

import { useEffect, useRef } from "react"
import { useChatStore } from "@/store/chat-store"
import { useAuthStore } from "@/store/auth-store"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils/utils"
import { format } from "date-fns"
import { Loader2, CheckCheck, Check } from "lucide-react"
import Image from "next/image"

function StatusIcon({ status }: { status: "SENT" | "DELIVERED" | "READ" }) {
  if (status === "READ") return <CheckCheck className="h-3 w-3 text-primary" />
  if (status === "DELIVERED")
    return <CheckCheck className="h-3 w-3 text-muted-foreground" />
  return <Check className="h-3 w-3 text-muted-foreground" />
}

export function MessageList() {
  const { user } = useAuthStore()
  const { messages, loadingMessages } = useChatStore()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  if (loadingMessages) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Say hello 👋</p>
      </div>
    )
  }

  // Group messages by date
  const grouped: { date: string; msgs: typeof messages }[] = []
  messages.forEach((msg) => {
    const date = format(new Date(msg.createdAt), "MMMM d, yyyy")
    const last = grouped[grouped.length - 1]
    if (last && last.date === date) {
      last.msgs.push(msg)
    } else {
      grouped.push({ date, msgs: [msg] })
    }
  })

  return (
    <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-4">
      {grouped.map(({ date, msgs }) => (
        <div key={date}>
          {/* Date separator */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium text-muted-foreground">
              {date}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {msgs.map((msg, i) => {
            const isMe = msg.senderId === user?.id
            const prevMsg = msgs[i - 1]
            const showAvatar =
              !isMe && (!prevMsg || prevMsg.senderId !== msg.senderId)

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  isMe ? "flex-row-reverse" : "flex-row",
                  i > 0 && "mt-1"
                )}
              >
                {/* Avatar for other user */}
                {!isMe && (
                  <div className="w-7 shrink-0">
                    {showAvatar && (
                      <Avatar className="h-7 w-7">
                        <AvatarImage
                          src={msg.sender.profileImage || "/avatar.png"}
                        />
                        <AvatarFallback className="text-[10px]">
                          {msg.sender.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )}

                <div
                  className={cn(
                    "flex max-w-[70%] flex-col gap-1",
                    isMe ? "items-end" : "items-start"
                  )}
                >
                  {/* Media */}
                  {msg.mediaUrl && msg.mediaType === "IMAGE" && (
                    <div className="overflow-hidden rounded-xl">
                      <Image
                        src={msg.mediaUrl}
                        alt="image"
                        width={240}
                        height={180}
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* Text bubble */}
                  {msg.text && (
                    <div
                      className={cn(
                        "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                        isMe
                          ? "rounded-br-sm bg-primary text-primary-foreground"
                          : "rounded-bl-sm bg-muted text-foreground"
                      )}
                    >
                      {msg.text}
                    </div>
                  )}

                  {/* Time + status */}
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      isMe ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <span className="text-[10px] text-muted-foreground">
                      {format(new Date(msg.createdAt), "h:mm a")}
                    </span>
                    {isMe && <StatusIcon status={msg.status} />}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  )
}
