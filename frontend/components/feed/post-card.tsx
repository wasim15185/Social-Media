"use client"

import { useState } from "react"
import Image from "next/image"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { MoreVertical, Pencil, Trash } from "lucide-react"

import { toggleLike } from "@/hooks/useLike"
import { savePost } from "@/hooks/useSavePost"
import { CommentSection } from "./comment-section"

import { useAuthStore } from "@/store/auth-store"

import {useRouter} from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { apiClient } from "@/lib/network/api-client"
import { EditPostModal } from "./edit-post-modal"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
 
export function PostCard({ post }: any) {
  const { user } = useAuthStore()

  const [likes, setLikes] = useState(post.likeCount)
  const [liked, setLiked] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const [openEdit, setOpenEdit] = useState(false)

  const isOwner = user?.id === post.authorId

  const router = useRouter()

  /**
   * Like Post
   */
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

  /**
   * Delete Post
   */
  const handleDelete = async () => {
    await apiClient.delete(`/posts/${post.id}`)
    window.location.reload()
  }

  return (
    <Card className="space-y-3 p-4">
      {/* HEADER */}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar className="cursor-pointer h-10 w-10">
            <AvatarImage src={post.author.profileImage} />
            <AvatarFallback>{post.author.username.charAt(0)}</AvatarFallback>
          </Avatar>

          <div>
            <p className="font-semibold">{post.author.username}</p>

            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Owner menu */}

        {isOwner && (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical size={18} />
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpenEdit(true)}>
                <Pencil size={16} className="mr-2" />
                Edit
              </DropdownMenuItem>

              <DropdownMenuItem onClick={handleDelete} className="text-red-500">
                <Trash size={16} className="mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* CONTENT */}

      <p>{post.content}</p>

      {/* IMAGE */}

     
      {post.images?.length > 0 && (
        <Image
          src={post.images[0].imageUrl}
          alt={`Image for post ${post.id} by ${post.author.username} ${post.createdAt}`}
          width={600}
          height={400}
          className="rounded-lg"
        />
         
      )}

      {/* ACTIONS */}

      <div className="flex justify-between pt-2">
        <Button variant="ghost" onClick={handleLike}>
          ❤️ {likes}
        </Button>

        <Button variant="ghost" onClick={() => setShowComments(!showComments)}>
          💬 {post.commentCount}
        </Button>

        <Button variant="ghost" onClick={() => savePost(post.id)}>
          🔖 Save
        </Button>
      </div>

      {/* COMMENTS */}

      {showComments && <CommentSection postId={post.id} />}

      {/* EDIT MODAL */}

      <EditPostModal open={openEdit} setOpen={setOpenEdit} post={post} />
    </Card>
  )
}
