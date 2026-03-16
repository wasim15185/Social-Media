"use client"

import { useEffect, useState } from "react"
import {apiClient as api } from "@/lib/network/api-client"

export function useFeed() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFeed = async () => {
    try {
      const res = await api.get("/posts/feed")

      setPosts(res.data.data)
    } catch (err: any) {
      setError("Failed to load feed")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFeed()
  }, [])

  return {
    posts,
    loading,
    error,
    refetch: fetchFeed,
  }
}
