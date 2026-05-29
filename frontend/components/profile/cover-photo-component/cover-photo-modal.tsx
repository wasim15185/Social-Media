"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import Cropper, { Area } from "react-easy-crop"

import { useState } from "react"

import { Button } from "@/components/ui/button"

import { Slider } from "@/components/ui/slider"

import { toast } from "sonner"

import { updateCover } from "@/lib/network/user"

import { getCroppedImg } from "./crop-image"

import { useAuthStore } from "@/store/auth-store"

type Props = {
  currentCover?: string | null

  children: React.ReactNode
}

export function CoverPhotoModal({ currentCover, children }: Props) {
  /**
   * Modal State
   */
  const [open, setOpen] = useState(false)

  /**
   * Loading
   */
  const [loading, setLoading] = useState(false)

  /**
   * Selected image
   */
  const [image, setImage] = useState<string>()

  /**
   * Crop state
   */
  const [crop, setCrop] = useState({
    x: 0,
    y: 0,
  })

  /**
   * Zoom state
   */
  const [zoom, setZoom] = useState(1)

  /**
   * Cropped pixels
   */
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  /**
   * Auth Store
   */
  const updateUser = useAuthStore((state) => state.updateUser)

  /**
   * Crop Complete
   */
  const onCropComplete = (_: Area, croppedPixels: Area) => {
    setCroppedAreaPixels(croppedPixels)
  }

  /**
   * Upload Cover
   */
  const handleSaveCover = async () => {
    try {
      if (!image || !croppedAreaPixels) {
        return
      }

      setLoading(true)

      /**
       * Crop image
       */
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels)

      /**
       * Blob -> File
       */
      const file = new File([croppedBlob], "cover.jpg", {
        type: "image/jpeg",
      })

      /**
       * Upload
       */
      const response = await updateCover(file)

      const coverImage = response.data.data.coverImage

      /**
       * Update Zustand
       */
      updateUser({
        coverImage,
      })

      toast.success("Cover photo updated successfully")

      setOpen(false)

      setImage(undefined)
    } catch (error) {
      console.error(error)

      toast.error("Failed to update cover photo")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Update Cover Photo</DialogTitle>
        </DialogHeader>

        {!image ? (
          <div className="space-y-4">
            {currentCover && (
              <img
                src={currentCover}
                alt="Current Cover"
                className="h-56 w-full rounded-xl object-cover"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]

                if (!file) return

                setImage(URL.createObjectURL(file))
              }}
            />
          </div>
        ) : (
          <>
            {/* Crop Area */}
            <div className="relative h-[450px] w-full overflow-hidden rounded-xl">
              <Cropper
                image={image}
                crop={crop}
                zoom={zoom}
                aspect={16 / 9}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            {/* Zoom */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Zoom</p>

              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                className="mx-auto w-full max-w-xs"
                onValueChange={(value) => {
               
                     setZoom(value as number)
                   
                  
                }}
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setImage(undefined)}>
                Choose Another
              </Button>

              <Button disabled={loading} onClick={handleSaveCover}>
                {loading ? "Uploading..." : "Save Cover"}
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
