"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

import { apiClient } from "@/lib/network/api-client"
import { useAuthStore } from "@/store/auth-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"

type Comment = {
  id: number
  content: string
  userId: number
  createdAt: string
  user: {
    id: number
    username: string
    profileImage: string | null
  }
}

export function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([])
  const [text, setText] = useState("")

  const user = useAuthStore((state) => state.user)

  /**
   * Fetch comments
   */
  const fetchComments = async () => {
    const res = await apiClient.get(`/posts/${postId}/comments`)
    setComments(res.data.data)
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  /**
   * Create comment
   */
  const handleComment = async () => {
    if (!text.trim()) return

    const res = await apiClient.post(`/posts/${postId}/comments`, {
      content: text,
    })

    setComments((prev) => [...prev, res.data.data])
    setText("")
  }

  /**
   * Delete comment
   */
  const handleDelete = async (id: number) => {
    const x = await apiClient.delete(`/posts/comments/${id}`)
    console.log(x)

    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-4 pt-3">
      {/* Comment list */}

      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3">
          {/* Avatar */}
          <Avatar className="cursor-pointer">
            {comment.user.profileImage ? (
              <AvatarImage src={comment.user.profileImage} />
            ) : (
              <AvatarFallback>
                {comment.user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          {/* Comment bubble */}

          <div className="flex-1">
            <div className="rounded-xl bg-muted px-3 py-2">
              <span className="mr-2 text-sm font-semibold">
                {comment.user.username}
              </span>

              <span className="text-sm">{comment.content}</span>
            </div>

            {/* actions */}

            <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
              <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>

              {user?.id === comment.userId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 text-[12px] text-red-400 hover:text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Add comment */}

      <div className="flex gap-2 pt-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />

        <Button onClick={handleComment}>Post</Button>
      </div>
    </div>
  )
}
