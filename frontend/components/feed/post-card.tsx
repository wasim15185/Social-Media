"use client"

import { useState } from "react"
import Image from "next/image"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import {
  MoreVertical,
  Pencil,
  Trash,
  Heart,
  MessageCircle,
  Bookmark,
} from "lucide-react"

import { toggleLike } from "@/hooks/useLike"
import { savePost } from "@/hooks/useSavePost"
import { CommentSection } from "./comment-section"

import { useAuthStore } from "@/store/auth-store"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { apiClient } from "@/lib/network/api-client"
import { EditPostModal } from "./edit-post-modal"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import Link from "next/link"

export function PostCard({ post }: any) {
  const { user } = useAuthStore()

  const [likes, setLikes] = useState(post.likeCount)
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const isOwner = user?.id === post.authorId

  const handleLike = async () => {
    setLiked(!liked)
    setLikes(liked ? likes - 1 : likes + 1)

    try {
      await toggleLike(post.id)
    } catch {
      setLiked(liked)
      setLikes(post.likeCount)
    }
  }

  const handleDelete = async () => {
    await apiClient.delete(`/posts/${post.id}`)
    window.location.reload()
  }

  return (
    <Card className="overflow-hidden p-0">
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 pb-3">
        <div className="flex items-center gap-3">
          <Link href={`/${post.author.id}`}>
            <div className="bg-gradient-brand rounded-full p-[2px]">
              <Avatar className="h-10 w-10 border-2 border-card">
                <AvatarImage
                  src={post.author.profileImage}
                  alt={`Profile image for ${post.author.username}`}
                />
                <AvatarFallback>
                  {post.author.username.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
          </Link>

          <div>
            <Link
              className="font-semibold hover:underline"
              href={`/${post.author.id}`}
            >
              {post.author.username}
            </Link>
            <p className="font-mono text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full p-1.5 hover:bg-accent">
              <MoreVertical size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                <Pencil size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive"
              >
                <Trash size={16} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* CONTENT */}
      {post.content && (
        <p className="px-4 pb-3 text-sm leading-relaxed">{post.content}</p>
      )}

      {/* IMAGE — edge to edge */}
      {post.images?.length > 0 && (
        <div className="relative aspect-[4/3] w-full bg-muted">
          <Image
            src={post.images[0].imageUrl}
            alt={`Image for post ${post.id} by ${post.author.username} ${post.createdAt}`}
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            className="object-cover"
          />
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center justify-between px-2 py-1">
        <Button
          variant="ghost"
          onClick={handleLike}
          className={`flex-1 gap-2 ${liked ? "text-[var(--brand-pink)]" : ""}`}
        >
          <Heart size={18} fill={liked ? "var(--brand-pink)" : "none"} />
          <span className="font-mono text-sm">{likes}</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => setShowComments(!showComments)}
          className="flex-1 gap-2 text-[var(--brand-violet)]"
        >
          <MessageCircle size={18} />
          <span className="font-mono text-sm">{post.commentCount}</span>
        </Button>

        <Button
          variant="ghost"
          onClick={() => savePost(post.id)}
          className="flex-1 gap-2 text-[var(--brand-orange)]"
        >
          <Bookmark size={18} />
          Save
        </Button>
      </div>

      {/* COMMENTS */}
      {showComments && (
        <div className="border-t px-4 pb-4">
          <CommentSection postId={post.id} />
        </div>
      )}

      <EditPostModal open={openEdit} setOpen={setOpenEdit} post={post} />
    </Card>
  )
}
