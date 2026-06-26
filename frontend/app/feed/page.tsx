"use client"

import { LeftSidebar } from "@/components/sidebar/left-sidebar"
import { RightSidebar } from "@/components/sidebar/right-sidebar"
import { CreatePost } from "@/components/feed/create-post"
import { FeedList } from "@/components/feed/feed-list"
import { ProtectedRoute } from "./protected-route"

export default function FeedPage() {
  return (
    <ProtectedRoute>
      <div className="relative min-h-screen bg-background">
        {/* AMBIENT BRAND GLOW */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full bg-[var(--brand-violet-soft)] blur-[120px]" />
          <div className="absolute -top-20 right-1/4 h-[380px] w-[380px] rounded-full bg-[var(--brand-pink-soft)] blur-[120px]" />
        </div>

        {/* LEFT SIDEBAR (FIXED) */}
        <div className="fixed top-20 left-[calc(50%-600px)] hidden w-[260px] lg:block">
          <LeftSidebar />
        </div>

        {/* RIGHT SIDEBAR (FIXED) */}
        <div className="fixed top-20 right-[calc(50%-600px)] hidden w-[300px] lg:block">
          <RightSidebar />
        </div>

        {/* FEED (CENTER) */}
        <div className="mx-auto max-w-[1200px] px-4 pt-6">
          <div className="mx-auto w-full max-w-[550px] space-y-4">
            <CreatePost />
            <FeedList />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
