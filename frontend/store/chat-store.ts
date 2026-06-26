import { create } from "zustand"
import { Conversation, Message } from "@/lib/api/chat"

interface ChatStore {
  conversations: Conversation[]
  activeConversationId: number | null
  messages: Message[]
  loadingConversations: boolean
  loadingMessages: boolean

  setConversations: (convs: Conversation[]) => void
  addOrUpdateConversation: (conv: Conversation) => void
  setActiveConversation: (id: number | null) => void
  setMessages: (msgs: Message[]) => void
  addMessage: (msg: Message) => void
  setLoadingConversations: (v: boolean) => void
  setLoadingMessages: (v: boolean) => void
  updateLastMessage: (conversationId: number, msg: Message) => void
}

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,

  setConversations: (conversations) => set({ conversations }),

  addOrUpdateConversation: (conv) =>
    set((state) => {
      const exists = state.conversations.find((c) => c.id === conv.id)
      if (exists) {
        return {
          conversations: state.conversations.map((c) =>
            c.id === conv.id ? conv : c
          ),
        }
      }
      return { conversations: [conv, ...state.conversations] }
    }),

  setActiveConversation: (id) =>
    set({ activeConversationId: id, messages: [] }),

  setMessages: (messages) => set({ messages }),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  setLoadingConversations: (loadingConversations) =>
    set({ loadingConversations }),

  setLoadingMessages: (loadingMessages) => set({ loadingMessages }),

  updateLastMessage: (conversationId, msg) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, messages: [msg] } : c
      ),
    })),
}))
