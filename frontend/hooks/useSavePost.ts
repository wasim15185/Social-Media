import { apiClient } from "@/lib/network/api-client"

export async function savePost(postId: number) {
  const res = await apiClient.post(`/posts/${postId}/save`)

  return res.data
}
