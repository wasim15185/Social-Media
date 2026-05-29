"use client"

import Image from "next/image"
import Link from "next/link"

import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreVertical,
  Pencil,
  Trash,
} from "lucide-react"

import { useState } from "react"

import { Card } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { PostResponseType } from "@/types/user.type"

type Props = {
  posts: PostResponseType[]

  username: string

  profileImage?: string | null
}

export function ProfilePostList({ posts, username, profileImage }: Props) {
  /**
   * Empty state
   */
  if (!posts.length) {
    return (
      <Card className="flex h-60 items-center justify-center rounded-3xl">
        <div className="text-center">
          <h3 className="text-lg font-semibold">No Posts Yet</h3>

          <p className="text-sm text-muted-foreground">
            Start sharing your moments ✨
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-5">
      {posts.map((post) => {
        /**
         * Local states
         */
        const [likes, setLikes] = useState(post.likeCount)

        const [showComments, setShowComments] = useState(false)

        /**
         * Like handler
         */
        const handleLike = () => {
          setLikes((prev) => prev + 1)
        }

        return (
          <Card key={post.id} className="space-y-4 rounded-3xl p-4 shadow-sm">
            {/* ---------------- HEADER ---------------- */}

            <div className="flex items-center justify-between">
              {/* LEFT */}
              <div className="flex items-center gap-3">
                <Link href={`/${username}`}>
                  <Avatar className="h-11 w-11 cursor-pointer">
                    <AvatarImage src={profileImage || ""} />

                    <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Link>

                <div>
                  <Link
                    href={`/${username}`}
                    className="hover:text-blue-600 hover:underline"
                  >
                    <p className="font-semibold">{username}</p>
                  </Link>

                  <p className="text-xs text-muted-foreground">
                    {new Date(post.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* RIGHT MENU */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <button className="rounded-full p-2 hover:bg-muted">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>

                  <DropdownMenuItem className="text-red-500">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* ---------------- CONTENT ---------------- */}

            {post.content && (
              <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            )}

            {/* ---------------- IMAGES ---------------- */}

            {!!post.images?.length && (
              <div
                className={`grid gap-1 overflow-hidden rounded-2xl ${
                  post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
                }`}
              >
                {post.images.map((image) => (
                  <div
                    key={image.id}
                    className="relative min-h-[300px] overflow-hidden bg-muted"
                  >
                    <Image
                      src={image.imageUrl}
                      alt={`Post Image ${image.id}`}
                      width={600}
                      height={400}
                      className="h-auto w-full object-cover transition duration-300 hover:scale-[1.02]"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ---------------- ACTIONS ---------------- */}

            <div className="flex items-center justify-between border-t pt-3">
              <Button variant="ghost" className="gap-2" onClick={handleLike}>
                <Heart className="h-4 w-4" />

                {likes}
              </Button>

              <Button
                variant="ghost"
                className="gap-2"
                onClick={() => setShowComments(!showComments)}
              >
                <MessageCircle className="h-4 w-4" />

                {post.commentCount}
              </Button>

              <Button variant="ghost" className="gap-2">
                <Bookmark className="h-4 w-4" />
                Save
              </Button>
            </div>

            {/* ---------------- COMMENTS ---------------- */}

            {showComments && (
              <div className="rounded-xl bg-muted p-4 text-sm text-muted-foreground">
                Comments section coming soon...
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )
}
