"use client"

import { useEffect, useState } from "react"
import { apiClient } from "@/lib/network/api-client"
import { FriendUser } from "./../app/friends/types/friend"

type Tab = "following" | "followers" | "suggestions"

export function useFriends(tab: Tab) {
  const [data, setData] = useState<FriendUser[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        let url = ""

        if (tab === "following") url = "/users/following"
        else if (tab === "followers") url = "/users/followers"
        else url = "/users"

        const res = await apiClient.get<{ data: FriendUser[] }>(url)

        setData(res.data.data)
      } catch (err) {
        console.error("Friends fetch error", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [tab])

  return { data, loading }
}
