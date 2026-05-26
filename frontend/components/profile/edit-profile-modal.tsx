"use client"
import {
  updateAvatar,
  updateCover,
  updateProfile,
} from "../../lib/network/user"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type Props = {
  open: boolean
  setOpen: (v: boolean) => void

  user?: {
    name?: string
    bio?: string

    profileImage?: string | null
    coverImage?: string | null
  }
}


export function EditProfileModal({ open, setOpen, user }: Props) {
  const [name, setName] = useState("")
  const [bio, setBio] = useState("")

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  /**
   * Sync user data
   */
  useEffect(() => {
    if (user) {
      setName(user.name || "")
      setBio(user.bio || "")
    }
  }, [user])

  /**
   * ---------------- AVATAR UPDATE ----------------
   */
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setAvatarPreview(URL.createObjectURL(file))

    try {
      await updateAvatar(file)
    } catch (err) {
      console.error("Avatar upload failed", err)
    }
  }

  /**
   * ---------------- COVER UPDATE ----------------
   */
  const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setCoverPreview(URL.createObjectURL(file))

    try {
      await updateCover(file)
    } catch (err) {
      console.error("Cover upload failed", err)
    }
  }

  /**
   * ---------------- BIO UPDATE ----------------
   */
  const handleSaveProfile = async () => {
    try {
      await updateProfile({ name, bio })
      setOpen(false)
    } catch (err) {
      console.error("Profile update failed", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg space-y-6">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        {/* ---------------- COVER SECTION ---------------- */}
        <div className="space-y-2">
          <p className="text-sm font-semibold">Cover Photo</p>

          <div className="relative h-32 w-full overflow-hidden rounded-xl border">
            <Image
              src={coverPreview || user?.coverImage || "/cover.jpg"}
              alt="cover"
              fill
              unoptimized={!!coverPreview}
              className="object-cover"
            />

            {/* EDIT BUTTON */}
            <label className="absolute top-2 right-2 cursor-pointer rounded bg-black/60 px-3 py-1 text-xs text-white">
              Edit
              <input hidden type="file" onChange={handleCoverChange} />
            </label>
          </div>
        </div>

        {/* ---------------- AVATAR SECTION ---------------- */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm font-semibold">Profile Photo</p>

          <div className="relative h-20 w-20 overflow-hidden rounded-full border">
            <Image
              src={avatarPreview || user?.profileImage || "/avatar.png"}
              alt="avatar"
              fill
              unoptimized={!!avatarPreview}
              className="object-cover"
            />

            {/* EDIT BUTTON */}
            <label className="absolute bottom-0 w-full cursor-pointer bg-black/60 py-1 text-center text-xs text-white">
              Edit
              <input hidden type="file" onChange={handleAvatarChange} />
            </label>
          </div>
        </div>

        {/* ---------------- BIO SECTION ---------------- */}
        <div className="space-y-3">
          <p className="text-sm font-semibold">Profile Info</p>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />

          <Input
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Bio"
          />

          <Button onClick={handleSaveProfile}>Save Profile Info</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
