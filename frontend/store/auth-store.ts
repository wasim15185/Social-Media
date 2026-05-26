"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

/**
 * ------------------------------------------------
 * User Type
 * ------------------------------------------------
 */
export type User = {
  id: number

  username: string

  name: string

  email: string

  profileImage?: string | null

  coverImage?: string | null

  bio?: string | null

  followerCount?: number

  followingCount?: number

  postCount?: number
}

/**
 * ------------------------------------------------
 * Auth Store State
 * ------------------------------------------------
 */
type AuthState = {
  /**
   * Current authenticated user
   */
  user: User | null

  /**
   * JWT token
   */
  token: string | null

  /**
   * Auth status
   */
  isAuthenticated: boolean

  /**
   * Login user
   */
  login: (user: User, token: string) => void

  /**
   * Update current user
   * (useful after profile/avatar update)
   */
  setUser: (user: User) => void

  /**
   * Logout user
   */
  logout: () => void
}

/**
 * ------------------------------------------------
 * Auth Store
 * ------------------------------------------------
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      /**
       * Initial state
       */
      user: null,

      token: null,

      isAuthenticated: false,

      /**
       * Login
       */
      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      /**
       * Update user
       */
      setUser: (user) =>
        set((state) => ({
          ...state,
          user,
        })),

      /**
       * Logout
       */
      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      /**
       * Local storage key
       */
      name: "auth-storage",
    }
  )
)

/*"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type User = {
  id: number
  username: string
  name: string
  email: string
  profileImage?: string
}

type AuthState = {
  user: User | null
  token: string | null
  isAuthenticated: boolean

  login: (user: User, token: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: "auth-storage",
    }
  )
)
*/
