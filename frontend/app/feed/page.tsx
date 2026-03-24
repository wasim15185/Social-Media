"use client"

import { LeftSidebar } from "@/components/sidebar/left-sidebar"
import { RightSidebar } from "@/components/sidebar/right-sidebar"
import { CreatePost } from "@/components/feed/create-post"
import { FeedList } from "@/components/feed/feed-list"
import { StoryBar } from "@/components/stories/story-bar"
import { ProtectedRoute } from "./protected-route"
import { SearchProvider } from "@/components/navbar/search/search-provider"

export default function FeedPage() {
  return (
    <ProtectedRoute>
       
        <div className="min-h-screen bg-muted/40">
          {/* LEFT SIDEBAR (FIXED) */}
          <div className="fixed top-20 left-[calc(50%-600px)] hidden w-[260px] lg:block">
            <LeftSidebar />
          </div>

          {/* RIGHT SIDEBAR (FIXED) */}
          <div className="fixed top-20 right-[calc(50%-600px)] hidden w-[300px] lg:block">
            <RightSidebar />
          </div>

          {/* FEED (CENTER) */}
          <div className="mx-auto max-w-[1200px] px-4 pt-20">
            <div className="mx-auto w-full max-w-[550px] space-y-4">
              <StoryBar />
              <CreatePost />
              <FeedList />
            </div>
          </div>
        </div>
       
    </ProtectedRoute>
  )
}
