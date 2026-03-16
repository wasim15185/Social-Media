"use client"

import { useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

import { apiClient } from "@/lib/network/api-client"

export function EditPostModal({ open, setOpen, post }: any) {
  const [content, setContent] = useState(post.content)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    if (!content.trim()) return

    setLoading(true)

    await apiClient.patch(`/posts/${post.id}`, {
      content,
    })

    setOpen(false)

    location.reload() // simple refresh (later we improve)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Post</DialogTitle>
        </DialogHeader>

        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Post"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
