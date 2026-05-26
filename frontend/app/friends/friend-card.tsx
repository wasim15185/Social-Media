"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FriendUser } from "./types/friend"
import { useFollow } from "@/hooks/use-follow"
import Link from "next/link"

export function FriendCard({ user }: { user: FriendUser }) {
  const { isFollowing, toggleFollow, loading } = useFollow(
    user.id,
    user.isFollowing
  )

  return (
    <Link href={`/${user.username}`}>
      <Card className="group cursor-pointer overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        {/* COVER */}
        <div className="h-20 w-full bg-gradient-to-r from-muted to-muted/50 transition group-hover:scale-105" />

        {/* CONTENT */}
        <div className="relative px-4 pb-4">
          <div className="-mt-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={user.profileImage || "/avatar.png"}
                className="h-14 w-14 rounded-full border-4 border-background object-cover transition group-hover:scale-105"
              />

              <div>
                <p className="font-semibold">{user.username}</p>
                <p className="text-xs text-muted-foreground">
                  {user.bio || "No bio"}
                </p>
              </div>
            </div>

            <Button
              size="sm"
              disabled={loading}
              onClick={toggleFollow}
              className="rounded-full px-4 transition-all"
              variant={isFollowing ? "secondary" : "default"}
            >
              {loading ? "..." : isFollowing ? "Following" : "Follow"}
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  )
}
