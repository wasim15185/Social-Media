"use client"

import { useState } from "react"
import Image from "next/image"
import { X, ImagePlus } from "lucide-react"

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
  const [existingImages, setExistingImages] = useState<any[]>(post.images || [])
  const [newImages, setNewImages] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * Existing image remove (only from UI state, actual delete on save)
   */
  const removeExistingImage = (id: number) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== id))
  }

  /**
   * Add new images, respecting 5-image total limit
   */
  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const remainingSlots = 5 - existingImages.length - newImages.length
    const selected = files.slice(0, Math.max(remainingSlots, 0))

    setNewImages((prev) => [...prev, ...selected])
    setNewPreviews((prev) => [
      ...prev,
      ...selected.map((file) => URL.createObjectURL(file)),
    ])
  }

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index))
    setNewPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handleUpdate = async () => {
    if (
      !content.trim() &&
      existingImages.length === 0 &&
      newImages.length === 0
    ) {
      return
    }

    setLoading(true)

    const formData = new FormData()
    formData.append("content", content)
    formData.append(
      "keepImageIds",
      JSON.stringify(existingImages.map((img) => img.id))
    )

    newImages.forEach((img) => {
      formData.append("images", img)
    })

    try {
      await apiClient.patch(`/posts/${post.id}`, formData, {
        headers: {
          "Content-Type": undefined,
        },
      })

      setOpen(false)
      location.reload() // simple refresh (later we improve)
    } catch (err) {
      console.error("Update error:", err)
    } finally {
      setLoading(false)
    }
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

        {/* IMAGE PREVIEWS (existing + new) */}
        {(existingImages.length > 0 || newPreviews.length > 0) && (
          <div className="grid grid-cols-2 gap-2">
            {existingImages.map((img) => (
              <div key={img.id} className="relative">
                <Image
                  src={img.imageUrl}
                  alt="post image"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => removeExistingImage(img.id)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {newPreviews.map((src, index) => (
              <div key={index} className="relative">
                <Image
                  src={src}
                  alt="new preview"
                  width={400}
                  height={300}
                  className="rounded-lg object-cover"
                />
                <button
                  onClick={() => removeNewImage(index)}
                  className="absolute top-1 right-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ADD MORE PHOTOS */}
        <label className="flex w-fit cursor-pointer items-center gap-2 text-sm">
          <ImagePlus size={16} />
          Add Photo
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleNewImages}
          />
        </label>

        <Button onClick={handleUpdate} disabled={loading}>
          {loading ? "Updating..." : "Update Post"}
        </Button>
      </DialogContent>
    </Dialog>
  )
}
