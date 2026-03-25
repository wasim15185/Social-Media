"use client"

import { useEffect, useState } from "react"
import { searchApi } from "@/lib/network/search"
import { SearchItem, SearchTab } from "@/components/navbar/search/type/search"

type Params = {
  query: string
  tab: SearchTab
}

export function useSearch({ query, tab }: Params) {
  const [results, setResults] = useState<SearchItem[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const cleanQuery = query.replace(/^[@#]/, "").trim()

    if (!cleanQuery) {
      setResults([])
      return
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true)

        const data = await searchApi(cleanQuery, tab)
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query, tab])

  return { results, loading }
}
