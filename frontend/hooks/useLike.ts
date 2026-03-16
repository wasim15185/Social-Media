"use client"

import { apiClient } from "@/lib/network/api-client"

export async function toggleLike(postId: number) {
  const res = await apiClient.post(`/likes/${postId}`)

  return res.data
}
