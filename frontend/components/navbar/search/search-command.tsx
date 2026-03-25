"use client"

import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  Command,
} from "@/components/ui/command"

import { useState, useMemo } from "react"
import { useRouter } from "next/navigation"

import { SearchTabs } from "./search-tabs"
import { SearchUserItem } from "./search-user-item"
import { SearchPostItem } from "./search-post-item"

import { SearchItem, SearchTab } from "./type/search"
import { useSearch } from "@/hooks/useSearch"

type Props = {
  open: boolean
  setOpen: (open: boolean) => void
}

export function SearchCommand({ open, setOpen }: Props) {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<SearchTab>("post")

  const router = useRouter()

  /**
   * 🔥 Auto detect (@ / #)
   */
  const detectedTab: SearchTab = useMemo(() => {
    if (query.startsWith("@")) return "user"
    if (query.startsWith("#")) return "post"
    return tab
  }, [query, tab])

  /**
   * 🚀 API
   */
  const { results, loading } = useSearch({
    query,
    tab: detectedTab,
  })

   

  /**
   * 🔢 Counts
   */
  const counts = useMemo(() => {
    return {
      user: results.filter((i) => i.type === "USER").length,
      post: results.filter((i) => i.type === "POST").length,
    }
  }, [results])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="rounded-xl shadow-xl">
        {/* INPUT */}
        <CommandInput
          placeholder="Search (@user / #post)..."
          value={query}
          onValueChange={setQuery}
        />

        {/* TABS */}
        <SearchTabs
          tab={tab}
          setTab={setTab}
          counts={counts}
          detectedTab={detectedTab}
        />

        {/* LIST */}
        <CommandList className="p-2">
          {loading ? (
            <div className="space-y-2 p-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 w-full animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : (
            <>
              <CommandEmpty>No results found</CommandEmpty>

              {results.map((item: SearchItem) => (
                <CommandItem
                  key={`${item.type}-${item.id}`}
                  value={item.type === "USER" ? item.username : item.content}
                  onSelect={() => {
                    setOpen(false)

                    if (item.type === "USER") {
                      router.push(`/profile/${item.username}`)
                    } else {
                      router.push(`/post/${item.id}`)
                    }
                  }}
                  className="rounded-xl p-3 hover:bg-muted/60"
                >
                  {item.type === "USER" ? (
                    <SearchUserItem item={item} />
                  ) : (
                    <SearchPostItem item={item} />
                  )}
                </CommandItem>
              ))}
            </>
          )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
