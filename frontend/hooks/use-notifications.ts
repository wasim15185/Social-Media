"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/network/api-client"
import { useNotificationStore } from "@/store/notification"

export const useNotifications = () => {
  const setNotifications = useNotificationStore((s) => s.setNotifications)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await apiClient.get("/users/notifications")

      // ✅ depending on your backend format
      const notifications = res.data?.data || res.data

      setNotifications(notifications)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return {
    loading,
    error,
    refetch: fetchNotifications,
  }
}
