"use client"

import { useState } from "react"
import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { updateAvatar } from "@/lib/network/user"

type Props = {
  currentImage?: string | null
}

export function AvatarUploadModal({ currentImage }: Props) {
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  /**
   * Upload avatar
   */
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    setPreview(URL.createObjectURL(file))

    try {
      setLoading(true)

      await updateAvatar(file)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog>
      {/* OPEN BUTTON */}
      <DialogTrigger asChild>
        <button className="w-full py-2 text-xs text-white">Edit</button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Profile Picture</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {/* PREVIEW */}
          <div className="relative h-32 w-32 overflow-hidden rounded-full border">
            {preview || currentImage ? (
              <Image
                src={preview || currentImage || ""}
                alt="avatar"
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                No Image
              </div>
            )}
          </div>

          {/* FILE INPUT */}
          <label className="cursor-pointer">
            <input
              
              type="file"
              accept="image/*"
              onChange={handleChange}
            />

            <Button type="button">
              {loading ? "Uploading..." : "Choose Image"}
            </Button>
          </label>
        </div>
      </DialogContent>
    </Dialog>
  )
}
