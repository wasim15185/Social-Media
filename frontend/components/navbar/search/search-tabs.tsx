"use client"

import { User, FileText } from "lucide-react"
import { SearchTab } from "./type/search"

type Props = {
  tab: SearchTab
  setTab: (tab: SearchTab) => void
  counts: {
    user: number
    post: number
  }
  detectedTab: SearchTab
}

export function SearchTabs({ tab, setTab, counts, detectedTab }: Props) {
  return (
    <div className="flex gap-2 border-b px-3 py-2">
      <button
        onClick={() => setTab("post")}
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm transition ${
          detectedTab === "post"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        <FileText size={14} />
        Posts ({counts.post})
      </button>
      <button
        onClick={() => setTab("user")}
        className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm transition ${
          detectedTab === "user"
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        <User size={14} />
        Users ({counts.user})
      </button>
    </div>
  )
}
