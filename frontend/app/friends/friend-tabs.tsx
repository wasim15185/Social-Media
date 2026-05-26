"use client"

import { cn } from "@/lib/utils/utils"

type Tab = "following" | "followers" | "suggestions"

type Props = {
  tab: Tab
  className?: string
  setTab: (tab: Tab) => void
}

export function FriendTabs({ tab, setTab, className }: Props) {
  const tabs: Tab[] = ["following", "followers", "suggestions"]

  return (
    <div className={cn("flex gap-2 border-b pb-3", className)}>
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={`rounded-full px-4 py-1 text-sm capitalize transition ${
            tab === t
              ? "bg-primary text-white"
              : "bg-muted text-muted-foreground hover:bg-muted/70"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  )
}
