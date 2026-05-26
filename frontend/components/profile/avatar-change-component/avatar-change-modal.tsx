"use client"

import React, { useState } from "react"

import Image from "next/image"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Camera } from "lucide-react"

import { toast } from "sonner"

import { updateAvatar } from "@/lib/network/user"

import { getInitials } from "@/lib/utils/getInitials"

import { useAuthStore } from "@/store/auth-store"

interface AvatarChangeModalProps {
  currentAvatar?: string | null

  displayName: string

  children: React.ReactNode
}

export function AvatarChangeModal({
  currentAvatar,
  displayName,
  children,
}: AvatarChangeModalProps) {
  /**
   * ---------------- STORE ----------------
   */
  const setUser = useAuthStore((state) => state.setUser)

  /**
   * ---------------- STATE ----------------
   */
  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  /**
   * Avatar preview
   */
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    currentAvatar || null
  )

  /**
   * ---------------- UPLOAD AVATAR ----------------
   */
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) return

    /**
     * Local instant preview
     */
    const localUrl = URL.createObjectURL(file)

    setPreviewUrl(localUrl)

    try {
      setLoading(true)

      /**
       * Upload API
       */
      const res = await updateAvatar(file)

      /**
       * Updated user from backend
       */
      const updatedUser = res.data.data

      /**
       * Update auth store globally
       */
      setUser(updatedUser)

      /**
       * Replace local preview
       * with uploaded image
       */
      setPreviewUrl(updatedUser.profileImage)

      /**
       * Success toast
       */
      toast.success("Profile photo updated successfully ✨")

      /**
       * Close modal
       */
      // setOpen(false)
    } catch (err) {
      console.error(err)

      toast.error("Failed to update profile photo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* OPEN BUTTON */}
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* MODAL */}
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        {/* HEADER */}
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle className="text-center text-xl font-semibold">
            Profile photo
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="flex flex-col items-center gap-8 p-8">
          {/* PREVIEW */}
          <div className="relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-full border-4 bg-muted shadow-xl">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt="Profile Preview"
                fill
                sizes="208px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-5xl font-bold">
                {getInitials(displayName)}
              </div>
            )}
          </div>

          {/* BUTTON */}
          <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={loading}
            onClick={() => document.getElementById("avatar-upload")?.click()}
          >
            <Camera className="h-4 w-4" />

            {loading ? "Uploading..." : "Update"}
          </Button>

          {/* HIDDEN FILE INPUT */}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileChange}
          />

          {/* FOOTER */}
          <p className="text-center text-xs text-muted-foreground">
            Click update to change your profile photo
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AvatarChangeModal
