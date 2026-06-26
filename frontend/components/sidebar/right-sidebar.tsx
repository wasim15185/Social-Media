"use client"

import { Card } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"
import { useTrending } from "@/hooks/useTrending"

export function RightSidebar() {
  const { trends, loading } = useTrending()

  return (
    <Card className="p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
        <TrendingUp size={14} />
        Trending
      </h3>

      {loading && <p className="text-sm text-muted-foreground">Loading...</p>}

      {!loading && trends.length === 0 && (
        <p className="text-sm text-muted-foreground">No trends yet</p>
      )}

      <div className="space-y-1">
        {trends.map((t) => (
          <button
            key={t.tag}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left hover:bg-accent"
          >
            <span className="text-sm font-medium" style={{ color: t.color }}>
              #{t.tag}
            </span>
            <span className="font-mono text-xs text-muted-foreground">
              {t.displayCount}
            </span>
          </button>
        ))}
      </div>
    </Card>
  )
}
