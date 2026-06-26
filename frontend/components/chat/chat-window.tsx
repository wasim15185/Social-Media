"use client"

import { useChatStore } from "@/store/chat-store"
import { useAuthStore } from "@/store/auth-store"
import { MessageList } from "./message-list"
import { MessageInput } from "./message-input"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import { Conversation } from "@/lib/network/chat-api"

function getOtherParticipant(conv: Conversation, myId: number) {
  return conv.participants.find((p) => p.userId !== myId)
}

interface ChatWindowProps {
  onSend: (text: string) => void
}

export function ChatWindow({ onSend }: ChatWindowProps) {
  const { user } = useAuthStore()
  const { activeConversationId, conversations } = useChatStore()

  const activeConversation = conversations.find(
    (c) => c.id === activeConversationId
  )

  const other = activeConversation
    ? getOtherParticipant(activeConversation, user!.id)
    : null

  if (!activeConversationId || !activeConversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
        <div className="rounded-full bg-muted p-5">
          <MessageCircle className="h-8 w-8 text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold">Your messages</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Select a conversation to start chatting.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <Avatar className="h-9 w-9">
          <AvatarImage src={other?.user.profileImage || "/avatar.png"} />
          <AvatarFallback>
            {other?.user.username?.slice(0, 2).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        <span className="font-semibold">{other?.user.username}</span>
      </div>

      {/* Messages */}
      <MessageList />

      {/* Input */}
      <MessageInput onSend={onSend} />
    </div>
  )
}
