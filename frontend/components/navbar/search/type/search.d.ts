export type EntityType = "USER" | "POST"

export type SearchTab = "user" | "post"

/**
 * ENTITY MODELS (UI-safe mapped data)
 */
export type UserItem = {
  id: number
  type: "USER"
  username: string
  profileImage: string
}

export type PostItem = {
  id: number
  type: "POST"
  content: string
}

export type SearchItem = UserItem | PostItem
