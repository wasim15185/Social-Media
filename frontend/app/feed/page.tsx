"use client"

import { LeftSidebar } from "@/components/sidebar/left-sidebar"
import { RightSidebar } from "@/components/sidebar/right-sidebar"
import { CreatePost } from "@/components/feed/create-post"
import { FeedList } from "@/components/feed/feed-list"
import { StoryBar } from "@/components/stories/story-bar"
import { ProtectedRoute } from "./protected-route"



export default function FeedPage() {
  return (
    <ProtectedRoute>
      <div className="mx-auto grid max-w-7xl grid-cols-12 gap-6 p-6">
        {/* LEFT SIDEBAR */}
        <div className="col-span-3 hidden lg:block">
          <LeftSidebar />
        </div>

        {/* FEED */}
        <div className="col-span-12 space-y-4 lg:col-span-6">
          <StoryBar />
          <CreatePost />
          <FeedList />
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="col-span-3 hidden lg:block">
          <RightSidebar />
        </div>
      </div>
    </ProtectedRoute>
  )
}
