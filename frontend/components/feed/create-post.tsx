"use client"

import { useState } from "react"
import Image from "next/image"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

import { Image as ImageIcon } from "lucide-react"

import { apiClient } from "@/lib/network/api-client"

export function CreatePost() {
  const [content, setContent] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * Handle image selection
   */
  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])

    const selected = files.slice(0, 5)

    setImages(selected)

    const previewUrls = selected.map((file) => URL.createObjectURL(file))

    setPreviews(previewUrls)
  }

  /**
   * Create post
   */
 const handlePost = async () => {
   if (!content && images.length === 0) return

   const formData = new FormData()
   formData.append("content", content)

   images.forEach((img) => {
     formData.append("images", img)
   })

   try {
     setLoading(true) // ← you were missing this!

     await apiClient.post("/posts", formData, {
       // THIS IS THE IMPORTANT LINE
       headers: {
         "Content-Type": undefined, // let axios set the correct multipart boundary
       },
     })

     // reset form
     setContent("")
     setImages([])
     setPreviews([])

     window.location.reload() // or better: use router.refresh() / context
   } catch (err) {
     console.error("Upload error:", err)
     // show toast here if you have one
   } finally {
     setLoading(false)
   }
 }

  return (
    <Card className="space-y-4 p-4">
      {/* TEXT INPUT */}

      <textarea
        placeholder="Start a post..."
        className="w-full resize-none rounded-md border p-3 outline-none"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* IMAGE PREVIEW */}

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {previews.map((src, index) => (
            <Image
              key={index}
              src={src}
              alt="preview"
              width={400}
              height={300}
              className="rounded-lg object-cover"
            />
          ))}
        </div>
      )}

      {/* ACTIONS */}

      <div className="flex items-center justify-between">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
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

        <Button onClick={handlePost} disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </Card>
  )
}
