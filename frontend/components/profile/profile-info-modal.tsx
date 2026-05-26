"use client"

import React, { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"

import { Textarea } from "@/components/ui/textarea"

import { toast } from "sonner"

import { Pencil } from "lucide-react"

import { updateProfile } from "@/lib/network/user"

import { useAuthStore } from "@/store/auth-store"

interface ProfileInfoModalProps {
  currentName?: string

  currentBio?: string | null

  children: React.ReactNode
}

export function ProfileInfoModal({
  currentName,
  currentBio,
  children,
}: ProfileInfoModalProps) {
  /**
   * ---------------- STORE ----------------
   */
  const user = useAuthStore((state) => state.user)

  const setUser = useAuthStore((state) => state.setUser)

  /**
   * ---------------- STATE ----------------
   */
  const [open, setOpen] = useState(false)

  const [loading, setLoading] = useState(false)

  const [name, setName] = useState(currentName || "")

  const [bio, setBio] = useState(currentBio || "")

  /**
   * Sync props
   */
  useEffect(() => {
    setName(currentName || "")

    setBio(currentBio || "")
  }, [currentName, currentBio])

  /**
   * ---------------- UPDATE PROFILE ----------------
   */
  const handleUpdateProfile = async () => {
    try {
      setLoading(true)

      /**
       * API
       */
      await updateProfile({
        name,
        bio,
      })

      /**
       * Update auth store
       */
      if (user) {
        setUser({
          ...user,
          name,
          bio,
        })
      }

      /**
       * Success
       */
      toast.success("Profile updated successfully ✨")

      /**
       * Close modal
       */
      setOpen(false)
    } catch (err) {
      console.error(err)

      toast.error("Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* TRIGGER */}
      <DialogTrigger >
        <button>
          {children}
        </button>
      </DialogTrigger>

      {/* MODAL */}
      <DialogContent className="sm:max-w-lg">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Pencil className="h-5 w-5" />
            Edit profile
          </DialogTitle>
        </DialogHeader>

        {/* BODY */}
        <div className="space-y-5">
          {/* NAME */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>

            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          {/* BIO */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>

            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write something about yourself..."
              className="min-h-[120px]"
              maxLength={160}
            />

            <div className="text-right text-xs text-muted-foreground">
              {bio.length}/160
            </div>
          </div>

          {/* ACTION */}
          <Button
            className="w-full"
            disabled={loading}
            onClick={handleUpdateProfile}
          >
            {loading ? "Saving..." : "Save changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ProfileInfoModal
