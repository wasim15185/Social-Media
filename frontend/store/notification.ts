import { create } from "zustand"

type Notification = {
  id: number
  type: string
  isRead?: boolean
  sender: {
    username: string
  }
  post?: {
    id: number
  }
}

type Store = {
  notifications: Notification[]
  setNotifications: (data: Notification[]) => void
  addNotification: (n: Notification) => void
  markAsRead: (id: number) => void
}

export const useNotificationStore = create<Store>((set) => ({
  notifications: [],

  setNotifications: (data) => set({ notifications: data }),

  addNotification: (newN) =>
    set((state) => {
      const exists = state.notifications.find((n) => n.id === newN.id)
      if (exists) return state

      return {
        notifications: [newN, ...state.notifications],
      }
    }),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),
}))
