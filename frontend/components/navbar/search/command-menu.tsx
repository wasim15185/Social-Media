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
import { User, FileText } from "lucide-react"

type UserItem = {
  id: number
  type: "user"
  username: string
  profileImage: string
}

type PostItem = {
  id: number
  type: "post"
  content: string
}

type SearchItem = UserItem | PostItem

const data: SearchItem[] = [
  { id: 1, type: "user", username: "wasim", profileImage: "/avatar.png" },
  { id: 2, type: "user", username: "john_doe", profileImage: "/avatar.png" },
  { id: 101, type: "post", content: "Building a social media app 🔥" },
  { id: 102, type: "post", content: "This is my first post 🚀" },
]

export function CommandMenu({ open, setOpen }: any) {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState<"user" | "post">("post") // ✅ default post

  const router = useRouter()

  /**
   * 🔥 Auto-detect type
   */
  const detectedTab = useMemo(() => {
    if (query.startsWith("@")) return "user"
    if (query.startsWith("#")) return "post"
    return tab
  }, [query, tab])

  /**
   * 🔥 Filter results
   */
  const results = useMemo(() => {
    if (!query) return []

    const q = query.replace(/^[@#]/, "").toLowerCase()

    return data.filter((item) => {
      if (item.type !== detectedTab) return false

      if (item.type === "user") {
        return item.username.toLowerCase().includes(q)
      }

      if (item.type === "post") {
        return item.content.toLowerCase().includes(q)
      }

      return false
    })
  }, [query, detectedTab])

  /**
   * 🔢 Count
   */
  const counts = useMemo(() => {
    const q = query.replace(/^[@#]/, "").toLowerCase()

    return {
      user: data.filter(
        (i) => i.type === "user" && i.username.toLowerCase().includes(q)
      ).length,

      post: data.filter(
        (i) => i.type === "post" && i.content.toLowerCase().includes(q)
      ).length,
    }
  }, [query])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <Command className="">
        {/* INPUT */}
        <CommandInput
          placeholder="Search users (@wasim) or posts (#react)..."
          value={query}
          onValueChange={setQuery}
        />

        {/* 🔥 TABS */}
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

        <CommandList className="p-2">
          <CommandEmpty>No results found</CommandEmpty>

          {results.map((item) => (
            <CommandItem
              key={`${item.type}-${item.id}`}
              onSelect={() => {
                setOpen(false)

                if (item.type === "user") {
                  router.push(`/profile/${item.username}`)
                }

                if (item.type === "post") {
                  router.push(`/post/${item.id}`)
                }
              }}
              className="rounded-lg px-3 py-2 hover:bg-muted"
            >
              {item.type === "user" ? (
                <div className="flex items-center gap-3">
                  <img
                    src={item.profileImage}
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium">{item.username}</span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span>{item.content.slice(0, 50)}</span>
                  <span className="text-xs text-muted-foreground">
                    View post →
                  </span>
                </div>
              )}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
