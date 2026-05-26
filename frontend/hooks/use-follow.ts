"use client"

import { useState } from "react"
import { apiClient } from "@/lib/network/api-client"

export const useFollow = (userId: number, initialState: boolean) => {
  const [isFollowing, setIsFollowing] = useState(initialState)
  const [loading, setLoading] = useState(false)

  const toggleFollow = async () => {
    if (loading) return

    try {
      setLoading(true)

      // ✅ Optimistic update
      const newState = !isFollowing
      setIsFollowing(newState)

      await apiClient.post(`/users/${userId}/follow`)

      return newState
    } catch (err) {
      // ❌ rollback
      setIsFollowing((prev) => !prev)
    } finally {
      setLoading(false)
    }
  }

  return {
    isFollowing,
    loading,
    toggleFollow,
  }
}
