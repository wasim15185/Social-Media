"use client"

import Image from "next/image"

import { Button } from "@/components/ui/button"

import { Images, SquarePen } from "lucide-react"

import { getInitials } from "@/lib/utils/getInitials"

import AvatarChangeModal from "./avatar-change-component/avatar-change-modal"

import { ProfileInfoModal } from "./profile-info-modal"

import { CoverPhotoModal } from "./cover-photo-component/cover-photo-modal"
type Props = {
  user: {
    username: string

    name?: string

    bio?: string | null

    profileImage?: string | null

    coverImage?: string | null

    followersCount: number

    followingCount: number

    postsCount: number
  }

  onEdit: () => void
}

export function ProfileHeader({ user, onEdit }: Props) {
  /**
   * ---------------------------------------------
   * Display name
   * ---------------------------------------------
   */
  const displayName = user.name || user.username

  /**
   * ---------------------------------------------
   * Gradient fallback
   * ---------------------------------------------
   */
  const gradients = [
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-orange-500",
    "from-blue-500 to-cyan-500",
  ]

  const gradient = gradients[user.username.length % gradients.length]

  return (
    <div className="overflow-hidden rounded-3xl border bg-card shadow-sm">
      {/* =======================================================
          COVER SECTION
      ======================================================= */}

      <div className="relative h-52 w-full overflow-hidden">
        {/* Cover Image */}
        {user.coverImage ? (
          <Image
            src={user.coverImage}
            alt={`${displayName} cover`}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-r ${gradient}`} />
        )}

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Cover Edit Button */}
        <div className="absolute top-4 right-4">
          {/* Future Cover Modal */}

          {/* <CoverPhotoModal
            currentCover={user.coverImage}
          > */}
          <CoverPhotoModal currentCover={user.coverImage}>
            <Button variant="secondary" className="gap-2" onClick={onEdit}>
              <Images className="h-4 w-4" />
              Edit Cover
            </Button>
          </CoverPhotoModal>

          {/* </CoverPhotoModal> */}
        </div>
      </div>

      {/* =======================================================
          PROFILE INFO SECTION
      ======================================================= */}

      <div className="px-6 pb-6">
        <div className="-mt-14 flex flex-col gap-4 md:flex-row md:items-end">
          {/* ======================================
              AVATAR
          ====================================== */}

          <AvatarChangeModal
            currentAvatar={user.profileImage}
            displayName={displayName}
          >
            <div className="relative h-28 w-28 cursor-pointer">
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={`${displayName} avatar`}
                  fill
                  className="rounded-full border-4 border-background object-cover shadow-lg"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full border-4 border-background bg-muted text-2xl font-bold shadow-lg">
                  {getInitials(displayName)}
                </div>
              )}
            </div>
          </AvatarChangeModal>

          {/* ======================================
              USER DETAILS
          ====================================== */}

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold">{displayName}</h1>

              <ProfileInfoModal currentName={user.name} currentBio={user.bio}>
                <Button size="icon" variant="outline">
                  <SquarePen className="h-4 w-4" />
                </Button>
              </ProfileInfoModal>
            </div>

            <p className="text-sm text-muted-foreground">@{user.username}</p>

            {user.bio && <p className="mt-2 max-w-2xl text-sm">{user.bio}</p>}
          </div>
        </div>

        {/* =======================================================
            STATS
        ======================================================= */}

        <div className="mt-6 flex flex-wrap gap-6 border-t pt-4 text-sm">
          <button className="cursor-pointer transition hover:opacity-80">
            <span className="font-bold">{user.postsCount}</span> Posts
          </button>

          <button className="cursor-pointer transition hover:opacity-80">
            <span className="font-bold">{user.followersCount}</span> Followers
          </button>

          <button className="cursor-pointer transition hover:opacity-80">
            <span className="font-bold">{user.followingCount}</span> Following
          </button>
        </div>
      </div>
    </div>
  )
}
