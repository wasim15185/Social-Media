"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useChat } from "@/hooks/use-chat"
import { ConversationList } from "@/components/chat/conversation-list"
import { ChatWindow } from "@/components/chat/chat-window"
import { useChatStore } from "@/store/chat-store"

export default function MessagesPage() {
  const { sendMessage } = useChat()
  const searchParams = useSearchParams()
  const { setActiveConversation, conversations } = useChatStore()

  // Friend card থেকে ?conversationId=X দিয়ে এলে auto-open
  useEffect(() => {
    const id = searchParams.get("conversationId")
    if (!id || !conversations.length) return
    setActiveConversation(Number(id))
  }, [searchParams, conversations])

  return (
    <div className="mx-auto flex h-[calc(100vh-56px)] max-w-[1200px] overflow-hidden">
      {/* Sidebar - conversation list */}
      <aside className="flex w-[300px] shrink-0 flex-col border-r">
        <div className="border-b px-4 py-3">
          <h1 className="text-base font-bold">Messages</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList />
        </div>
      </aside>

      {/* Main chat window */}
      <main className="flex flex-1 flex-col overflow-hidden">
        <ChatWindow onSend={sendMessage} />
      </main>
    </div>
  )
}
