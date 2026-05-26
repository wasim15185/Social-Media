export type UserResponseType = {
  id: number

  username: string

  name?: string
  bio?: string

  profileImage?: string | null
  coverImage?: string | null

  followerCount: number
  followingCount: number
  postCount: number
}
