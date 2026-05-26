"use client"

import { useState } from "react"
import { FriendTabs } from "./friend-tabs"
import { FriendSection } from "./friend-section"
import { useFriends } from "@/hooks/use-friends"

type Tab = "following" | "followers" | "suggestions"

export default function FriendsPage() {
  const [tab, setTab] = useState<Tab>("following")

  const { data, loading } = useFriends(tab)

  return (
    <main className="mx-auto max-w-[1200px] space-y-6">
      {/* HEADER - Normal (NOT sticky) */}
      <div className="space-y-3 pb-2">
        <h1 className="mt-10 text-xl font-bold">Friends</h1>
        <FriendTabs tab={tab} setTab={setTab} />
      </div>

      
      <div className="sticky top-20 z-10 bg-background">
         
        
        <FriendSection title={tab} users={data} loading={loading} />
      </div>
    </main>
  )
}
