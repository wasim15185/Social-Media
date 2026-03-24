export type UserItem = {
  id: number
  type: "user"
  username: string
  profileImage: string
}

export type PostItem = {
  id: number
  type: "post"
  content: string
}

export type SearchItem = UserItem | PostItem
