"use client"

import { useState } from "react"
import Image from "next/image"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Image as ImageIcon, X } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { apiClient } from "@/lib/network/api-client"
import { useAuthStore } from "@/store/auth-store"

export function CreatePost() {
  const { user } = useAuthStore()

  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const selected = files.slice(0, 5)
    setImages(selected)
    setPreviews(selected.map((file) => URL.createObjectURL(file)))
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePost = async () => {
    if (!content && images.length === 0) return

    const formData = new FormData()
    formData.append("content", content)
    images.forEach((img) => formData.append("images", img))

    try {
      setLoading(true)

      await apiClient.post("/posts", formData, {
        headers: { "Content-Type": undefined },
      })

      setContent("")
      setImages([])
      setPreviews([])
      window.location.reload()
    } catch (err) {
      console.error("Upload error:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <div className="bg-gradient-brand h-fit rounded-full p-[2px]">
          <Avatar className="h-10 w-10 border-2 border-card">
            <AvatarImage src={user?.profileImage || "/avatar.png"} />
            <AvatarFallback>
              {user?.username?.slice(0, 2).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </div>

        <Textarea
          placeholder="Share something with your network..."
          className="min-h-[44px] flex-1 resize-none rounded-2xl border-none bg-muted px-4 py-3 outline-none focus-visible:ring-1 focus-visible:ring-[var(--brand-violet)]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {previews.length > 0 && (
        <div className="mt-3 grid grid-cols-2 gap-2">
          {previews.map((src, index) => (
            <div key={index} className="relative">
              <Image
                src={src}
                alt="preview"
                width={400}
                height={300}
                className="h-40 w-full rounded-xl object-cover"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 rounded-full bg-black/60 p-1 text-white"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <label className="flex cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--brand-orange)] hover:bg-accent">
          <ImageIcon size={16} />
          Photo
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={handleImages}
          />
        </label>

        <Button
          onClick={handlePost}
          disabled={loading}
          className="bg-gradient-brand text-white hover:opacity-90"
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </Card>
  )
}
