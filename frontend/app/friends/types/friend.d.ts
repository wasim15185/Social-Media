export type FriendUser = {
  id: number
  username: string
  profileImage: string | null
  coverImage?: string | null
  bio?: string | null
  isFollowing: boolean
}
