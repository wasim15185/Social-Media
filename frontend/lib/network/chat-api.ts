import { apiClient } from "@/lib/network/api-client"

export interface Participant {
  id: number
  userId: number
  conversationId: number
  unreadCount: number
  user: {
    id: number
    username: string
    profileImage: string | null
  }
}

export interface Message {
  id: number
  senderId: number
  conversationId: number
  text: string | null
  mediaUrl: string | null
  mediaType: "IMAGE" | "VIDEO" | null
  status: "SENT" | "DELIVERED" | "READ"
  createdAt: string
  sender: {
    id: number
    username: string
    profileImage: string | null
  }
}

export interface Conversation {
  id: number
  createdAt: string
  participants: Participant[]
  messages: Message[]
}

export const chatApi = {
  createConversation: async (targetUserId: number): Promise<Conversation> => {
    const res = await apiClient.post("/chat/conversation", { targetUserId })
    return res.data.data
  },

  getConversations: async (): Promise<Conversation[]> => {
    const res = await apiClient.get("/chat/conversations")
    return res.data.data
  },

  getMessages: async (conversationId: number): Promise<Message[]> => {
    const res = await apiClient.get(`/chat/${conversationId}/messages`)
    return res.data.data
  },

  sendMessage: async (
    conversationId: number,
    payload: { text?: string; mediaUrl?: string; mediaType?: "IMAGE" | "VIDEO" }
  ): Promise<Message> => {
    const res = await apiClient.post(`/chat/${conversationId}/message`, payload)
    return res.data.data
  },
}