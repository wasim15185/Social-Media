"use client"

import { useEffect, useState } from "react"

import { apiClient } from "@/lib/network/api-client"
import { useAuthStore } from "@/store/auth-store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { Trash2, Send } from "lucide-react"
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

  const fetchComments = async () => {
    const res = await apiClient.get(`/posts/${postId}/comments`)
    setComments(res.data.data)
  }

  useEffect(() => {
    fetchComments()
  }, [postId])

  const handleComment = async () => {
    if (!text.trim()) return

    const res = await apiClient.post(`/posts/${postId}/comments`, {
      content: text,
    })

    setComments((prev) => [...prev, res.data.data])
    setText("")
  }

  const handleDelete = async (id: number) => {
    await apiClient.delete(`/posts/comments/${id}`)
    setComments((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div className="space-y-4 pt-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-start gap-3">
          <div className="bg-gradient-brand h-fit rounded-full p-[1.5px]">
            <Avatar className="h-8 w-8 border-2 border-card">
              {comment.user.profileImage && (
                <AvatarImage src={comment.user.profileImage} />
              )}
              <AvatarFallback className="text-xs">
                {comment.user.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1">
            <div className="rounded-2xl bg-muted px-3 py-2">
              <span className="mr-2 text-sm font-semibold">
                {comment.user.username}
              </span>
              <span className="text-sm">{comment.content}</span>
            </div>

            <div className="mt-1 flex items-center gap-3 px-1 font-mono text-xs text-muted-foreground">
              <span>{new Date(comment.createdAt).toLocaleTimeString()}</span>

              {user?.id === comment.userId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="flex items-center gap-1 font-sans text-destructive hover:underline"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      <div className="flex gap-2 pt-2">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="rounded-full bg-muted"
          onKeyDown={(e) => e.key === "Enter" && handleComment()}
        />
        <Button
          onClick={handleComment}
          size="icon"
          className="bg-gradient-brand text-white hover:opacity-90"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  )
}
