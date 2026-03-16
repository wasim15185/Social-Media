"use client"

import { useAuthStore } from "@/store/auth-store"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.replace("/login")
    }
  }, [mounted, isAuthenticated, router])

  if (!mounted) return null

  if (!isAuthenticated) return null

  return <>{children}</>
}
