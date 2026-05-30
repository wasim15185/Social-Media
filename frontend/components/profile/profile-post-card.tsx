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
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import { PostResponseType } from "@/types/user.type"

type Props = {
  post: PostResponseType
  username: string
  profileImage?: string | null
  currentUserId: number
}

export function ProfilePostCard({
  post,
  username,
  profileImage,
  currentUserId,
}: Props) {
  const [likes, setLikes] = useState(post.likeCount)

  const [showComments, setShowComments] = useState(false)

  console.log(post)

  const isOwner = currentUserId === post.authorId

  const handleLike = () => {
    setLikes((prev) => prev + 1)
  }

  const handleEdit = (postId: number) => {
    console.log("Edit Post", postId)
  }

  const handleDelete = (postId: number) => {
    console.log("Delete Post", postId)
  }

  return (
    <Card className="space-y-4 rounded-3xl p-4 shadow-sm">
      {/* HEADER */}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href={`/${username}`}>
            <Avatar className="h-11 w-11 cursor-pointer">
              <AvatarImage src={profileImage || ""} />
              <AvatarFallback>{username.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>

          <div>
            <Link href={`/${username}`}>
              <p className="font-semibold hover:text-blue-600 hover:underline">
                {username}
              </p>
            </Link>

            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Only Owner Can Edit/Delete */}

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger  >
              <button className="rounded-full p-2 hover:bg-muted">
                <MoreVertical className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleEdit(post.id)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => handleDelete(post.id)}
                className="text-red-500"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* CONTENT */}

      {post.content && (
        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
          {post.content}
        </p>
      )}

      {/* IMAGES */}

      {!!post.images?.length && (
        <div
          className={`grid gap-1 overflow-hidden rounded-2xl ${
            post.images.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {post.images.map((image) => (
            <div
              key={image.id}
              className="relative min-h-[300px] overflow-hidden"
            >
              <Image
                src={image.imageUrl}
                alt=""
                width={600}
                height={400}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {/* ACTIONS */}

      <div className="flex items-center justify-between border-t pt-3">
        <Button variant="ghost" className="gap-2" onClick={handleLike}>
          <Heart className="h-4 w-4" />
          {likes}
        </Button>

        <Button
          variant="ghost"
          className="gap-2"
          onClick={() => setShowComments((prev) => !prev)}
        >
          <MessageCircle className="h-4 w-4" />
          {post.commentCount}
        </Button>

        <Button variant="ghost" className="gap-2">
          <Bookmark className="h-4 w-4" />
          Save
        </Button>
      </div>

      {showComments && (
        <div className="rounded-xl bg-muted p-4">Comments coming soon...</div>
      )}
    </Card>
  )
}
