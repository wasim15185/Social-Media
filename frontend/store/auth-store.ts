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
   * Current logged in user
   */
  user: User | null

  /**
   * JWT token
   */
  token: string | null

  /**
   * Authentication status
   */
  isAuthenticated: boolean

  /**
   * Login
   */
  login: (user: User, token: string) => void

  /**
   * Replace full user object
   */
  setUser: (user: User) => void

  /**
   * Partial update
   *
   * Useful for:
   * - avatar update
   * - cover update
   * - bio update
   */
  updateUser: (updates: Partial<User>) => void

  /**
   * Logout
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
       * Replace user
       */
      setUser: (user) =>
        set({
          user,
        }),

      /**
       * Partial update user
       */
      updateUser: (updates) =>
        set((state) => ({
          user: state.user
            ? {
                ...state.user,
                ...updates,
              }
            : null,
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
