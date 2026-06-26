"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FriendUser } from "./types/friend"
import { useFollow } from "@/hooks/use-follow"
import { chatApi } from "@/lib/network/chat-api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageCircle } from "lucide-react"
import { useState } from "react"

export function FriendCard({ user }: { user: FriendUser }) {
  const { isFollowing, toggleFollow, loading } = useFollow(
    user.id,
    user.isFollowing
  )
  const router = useRouter()
  const [msgLoading, setMsgLoading] = useState(false)

  const handleMessage = async (e: React.MouseEvent) => {
    e.preventDefault() // Link এ navigate হবে না
    e.stopPropagation()

    try {
      setMsgLoading(true)
      const conversation = await chatApi.createConversation(user.id)
      router.push(`/messages?conversationId=${conversation.id}`)
    } catch (err) {
      console.error("Failed to create conversation", err)
    } finally {
      setMsgLoading(false)
    }
  }

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

            {/* Buttons */}
            <div className="flex items-center gap-2">
              {/* Message button */}
              <Button
                size="sm"
                variant="outline"
                disabled={msgLoading}
                onClick={handleMessage}
                className="rounded-full px-3 transition-all"
              >
                <MessageCircle size={14} className="mr-1" />
                {msgLoading ? "..." : "Message"}
              </Button>

              {/* Follow button */}
              <Button
                size="sm"
                disabled={loading}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  toggleFollow()
                }}
                className="rounded-full px-4 transition-all"
                variant={isFollowing ? "secondary" : "default"}
              >
                {loading ? "..." : isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  )
}
