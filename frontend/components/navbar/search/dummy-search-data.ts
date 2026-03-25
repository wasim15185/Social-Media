import { SearchItem } from "./type/search"

export const users: SearchItem[] = [
  {
    id: 1,
    type: "user",
    username: "wasim",
    profileImage: "/avatar.png",
  },
  {
    id: 2,
    type: "user",
    username: "john_doe",
    profileImage: "/avatar.png",
  },
]

export const posts: SearchItem[] = [
  {
    id: 101,
    type: "post",
    content: "This is my first post 🚀",
  },
  {
    id: 102,
    type: "post",
    content: "Building a social media app 🔥",
  },
]

export const data: SearchItem[] = [...users, ...posts]