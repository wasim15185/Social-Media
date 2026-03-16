"use client"

import { AuthAPI } from "@/lib/network/auth-api"
import { useState } from "react"

export function useAuth() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (data: { email: string; password: string }) => {
    try {
      setLoading(true)
      setError(null)

      const result = await AuthAPI.login(data)

      localStorage.setItem("token", result.data.token)

      return result
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: any) => {
    try {
      setLoading(true)
      setError(null)

      const result = await AuthAPI.register(data)

      localStorage.setItem("token", result.data.token)

      return result
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
  }

  return {
    login,
    register,
    logout,
    loading,
    error,
  }
}
