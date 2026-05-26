"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getInitials } from "@/lib/utils/getInitials"
import { Images, SquarePen } from "lucide-react"
import { ProfileInfoModal } from "./profile-info-modal"

import AvatarChangeModal from "./avatar-change-component/avatar-change-modal"
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
   * Get display name safely
   */
  const displayName = user.name || user.username

  /**
   * Gradient fallback (stable based on username)
   */
  const gradients = [
    "from-indigo-500 to-purple-500",
    "from-pink-500 to-orange-500",
    "from-blue-500 to-cyan-500",
  ]

  const gradient = gradients[user.username.length % gradients.length]

  return (
    <div className="overflow-hidden rounded-2xl border bg-card">
      {/* ---------------- COVER ---------------- */}
      <div className="relative h-40 w-full">
        {user.coverImage ? (
          <Image
            src={user.coverImage}
            alt="cover"
            fill
            className="object-cover"
          />
        ) : (
          <div className={`h-full w-full bg-gradient-to-r ${gradient}`} />
        )}

        <Button
          // aria-label="Submit"
          className="absolute top-4 right-4"
          onClick={onEdit}
        >
          <Images className="h-1 w-1" />
          <>Edit Cover Edit</>
        </Button>
      </div>

      {/* ---------------- INFO ---------------- */}
      <div className="px-6 pb-4">
        <div className="-mt-12 flex items-center gap-4">
          {/* AVATAR (Profile Picture) */}
          <div className="group relative h-24 w-24 overflow-hidden">
            <AvatarChangeModal
              currentAvatar={user.profileImage}
              displayName={displayName}
            >
              {user.profileImage ? (
                <Image
                  src={user.profileImage}
                  alt={`avatar of ${user.name}`}
                  fill
                  className="rounded-full border-4 border-background object-cover"
                />
              ) : (
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border-4 border-background bg-muted text-lg font-semibold">
                  {getInitials(displayName)}
                </div>
              )}
            </AvatarChangeModal>
          </div>

          {/* USER INFO */}
          <div className="mt-12">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-semibold">{user.name}</h3>
              <ProfileInfoModal currentName={user.name} currentBio={user.bio}>
                <Button size="icon-xs" aria-label="Submit" variant="outline">
                  <SquarePen className="h-4 w-4" />
                </Button>
              </ProfileInfoModal>
            </div>
            <p className="text-muted-foreground">@{user.username}</p>
          </div>
        </div>

        {/* ---------------- STATS ---------------- */}
        <div className="mt-4 flex gap-6 text-sm">
          <span>
            <b>{user.postsCount}</b> Posts
          </span>

          <span className="cursor-pointer hover:underline">
            <b>{user.followersCount}</b> Followers
          </span>

          <span className="cursor-pointer hover:underline">
            <b>{user.followingCount}</b> Following
          </span>
        </div>
      </div>
    </div>
  )
}
