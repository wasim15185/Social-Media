"use client"

import { useEffect, useRef } from "react"
import { socket } from "@/lib/socket"
import { chatApi, Message } from "@/lib/network/chat-api"
import { useChatStore } from "@/store/chat-store"
import { useAuthStore } from "@/store/auth-store"

export function useChat() {
  const { user } = useAuthStore()
  const {
    activeConversationId,
    setConversations,
    setMessages,
    addMessage,
    setLoadingConversations,
    setLoadingMessages,
    updateLastMessage,
  } = useChatStore()

  const joinedRooms = useRef<Set<number>>(new Set())

  // Load all conversations on mount
  useEffect(() => {
    const load = async () => {
      setLoadingConversations(true)
      try {
        const convs = await chatApi.getConversations()
        setConversations(convs)
      } finally {
        setLoadingConversations(false)
      }
    }
    load()
  }, [])

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId) return

    const load = async () => {
      setLoadingMessages(true)
      try {
        const msgs = await chatApi.getMessages(activeConversationId)
        setMessages(msgs)
      } finally {
        setLoadingMessages(false)
      }
    }
    load()

    // Join the socket room for this conversation
    if (!joinedRooms.current.has(activeConversationId)) {
      socket.emit("join-conversation", activeConversationId)
      joinedRooms.current.add(activeConversationId)
    }
  }, [activeConversationId])

  // Listen for incoming messages
  useEffect(() => {
    const handleReceive = (msg: Message) => {
      // Only add to current view if it's the active conversation
      if (msg.conversationId === activeConversationId) {
        addMessage(msg)
      }
      // Always update sidebar preview
      updateLastMessage(msg.conversationId, msg)
    }

    socket.on("receive-message", handleReceive)
    return () => {
      socket.off("receive-message", handleReceive)
    }
  }, [activeConversationId, addMessage, updateLastMessage])

  const sendMessage = async (text: string) => {
    if (!activeConversationId || !text.trim()) return

    await chatApi.sendMessage(activeConversationId, { text: text.trim() })
    // Message will arrive via socket "receive-message" event
  }

  return { sendMessage }
}
