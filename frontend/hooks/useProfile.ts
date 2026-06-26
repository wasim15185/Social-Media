"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/network/api-client"

export function useProfile(userId?: number) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = async () => {
    if (!userId) return

    try {
      setLoading(true)
      const res = await apiClient.get(`/users/${userId}`)
      setProfile(res.data.data)
    } catch (err) {
      setError("Failed to load profile")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProfile()
  }, [userId])

  return { profile, loading, error, refetch: fetchProfile }
}
