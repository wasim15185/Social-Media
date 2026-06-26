"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/network/api-client"

type Trend = {
  tag: string
  count: number
  displayCount: string
  color: string
}

const COLORS = [
  "var(--brand-violet)",
  "var(--brand-pink)",
  "var(--brand-orange)",
]

function formatCount(n: number) {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`
}

export function useTrending() {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient
      .get("/trending/hashtags")
      .then((res) => {
        const data: { tag: string; count: number }[] = res.data.data

        setTrends(
          data.map((t, i) => ({
            ...t,
            displayCount: formatCount(t.count),
            color: COLORS[i % COLORS.length],
          }))
        )
      })
      .catch((err) => {
        console.error("Failed to load trending hashtags:", err)
      })
      .finally(() => setLoading(false))
  }, [])
  return { trends, loading }
}
