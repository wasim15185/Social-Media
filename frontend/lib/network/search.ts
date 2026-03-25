import { apiClient } from "@/lib/network/api-client"
import { SearchItem, SearchTab } from "@/components/navbar/search/type/search"

/**
 * Raw API types
 */
type ApiUser = {
  id: number
  username: string
  profileImage: string
}

type ApiPost = {
  id: number
  content: string
}

/**
 * 🔥 Search API
 */
export async function searchApi(
  query: string,
  tab: SearchTab
): Promise<SearchItem[]> {
  const cleanQuery = query.replace(/^[@#]/, "").trim()

  if (!cleanQuery) return []

  /**
   * USER SEARCH
   */
  if (tab === "user") {
    const res = await apiClient.get<{ data: ApiUser[] }>(
      `/search/users?q=${cleanQuery}`
    )

    return res.data.data.map((u) => ({
      id: u.id,
      type: "USER", // 🔥 entity type
      username: u.username,
      profileImage: u.profileImage,
    }))
  }

  /**
   * POST SEARCH
   */
  const res = await apiClient.get<{ data: ApiPost[] }>(
    `/search/posts?q=${cleanQuery}`
  )

  return res.data.data.map((p) => ({
    id: p.id,
    type: "POST", // 🔥 entity type
    content: p.content,
  }))
}
