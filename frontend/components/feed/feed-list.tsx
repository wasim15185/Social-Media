"use client"

import { useFeed } from "@/hooks/useFeed"
import { PostCard } from "./post-card"

export function FeedList() {
  const { posts, loading, error } = useFeed()

  if (loading) {
    return <p>Loading feed...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  return (
    <div className="space-y-4">
      {posts.map((post: any) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
