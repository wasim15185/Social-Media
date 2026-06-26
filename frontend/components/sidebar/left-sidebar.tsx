"use client"

import { Card } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Bookmark, Users, UserPlus } from "lucide-react"
import { useAuthStore } from "@/store/auth-store"
import { useProfile } from "@/hooks/useProfile"

export function LeftSidebar() {
  const { user } = useAuthStore()
  const { profile, loading } = useProfile(user?.id)

  return (
    <Card className="overflow-hidden p-0">
      {/* COVER STRIP */}
      <div className="bg-gradient-brand h-16" />

      {/* PROFILE */}
      <div className="flex flex-col items-center px-4 pb-4 text-center">
        <div className="bg-gradient-brand -mt-8 rounded-full p-[3px]">
          <Avatar className="h-16 w-16 border-[3px] border-card">
            <AvatarImage src={profile?.profileImage || "/avatar.png"} />
            <AvatarFallback>
              {profile?.username?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        <h2 className="mt-3 font-semibold">
          {loading ? "Loading..." : profile?.name || profile?.username}
        </h2>
        <p className="text-sm text-muted-foreground">
          {profile?.bio || "No bio yet"}
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 gap-px border-t bg-border">
        <div className="bg-card px-3 py-3 text-center">
          <p className="font-mono text-base font-semibold">
            {profile?.followerCount ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Followers</p>
        </div>
        <div className="bg-card px-3 py-3 text-center">
          <p className="font-mono text-base font-semibold">
            {profile?.followingCount ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Following</p>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="space-y-1 border-t p-2">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent">
          <Bookmark size={16} className="text-[var(--brand-orange)]" />
          Saved Posts
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent">
          <Users size={16} className="text-[var(--brand-violet)]" />
          Connections
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-accent">
          <UserPlus size={16} className="text-[var(--brand-pink)]" />
          Find Friends
        </button>
      </div>
    </Card>
  )
}