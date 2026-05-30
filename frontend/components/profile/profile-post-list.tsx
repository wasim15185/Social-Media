"use client"

import { PostResponseType } from "@/types/user.type"
import { ProfilePostCard } from "./profile-post-card"
type Props = {
  posts: PostResponseType[]
  username: string
  profileImage?: string | null
  currentUserId: number
}

export function ProfilePostList({
  posts,
  username,
  profileImage,
  currentUserId,
}: Props) {
  if (!posts.length) {
    return (
      <div className="rounded-3xl border p-10 text-center">
        <h3 className="text-lg font-semibold">No Posts Yet</h3>
        <p className="text-muted-foreground">Start sharing your moments ✨</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => (
        <ProfilePostCard
          key={post.id}
          post={post}
          username={username}
          profileImage={profileImage}
          currentUserId={currentUserId}
        />
      ))}
    </div>
  )
}
