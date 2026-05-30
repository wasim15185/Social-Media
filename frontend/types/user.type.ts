export type ImageResponseType = {
  id: number

  imageUrl: string
}

export type PostResponseType = {
  id: number

  content: string

  createdAt: string

  likeCount: number

  commentCount: number

  authorId: number

  images: ImageResponseType[]
}

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

  // author:{
  //   id: number

  //   profileImage: string

  //   username: string
  // }

  posts: PostResponseType[]
}
