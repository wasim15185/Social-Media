"use client"

import { useEffect, useState } from "react"

import { useAuthStore } from "@/store/auth-store"

import { apiClient } from "@/lib/network/api-client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { CreatePostBox } from "@/components/profile/create-post-box"
import { FeedList } from "@/components/feed/feed-list"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { EditProfileModal } from "@/components/profile/edit-profile-modal"
import { UserResponseType } from "@/types/user.type"

export default function ProfilePage() {
  const [tab, setTab] = useState<"posts" | "photos" | "saved">("posts")

  const [open, setOpen] = useState(false)

  const [profileUser, setProfileUser] = useState<UserResponseType | null>(null)

  const [loading, setLoading] = useState(true)

  console.log(profileUser)

  /**
   * Logged-in user from auth store
   */
  const authUser = useAuthStore((state) => state.user)

  /**
   * Fetch profile
   */
  useEffect(() => {
    if (!authUser?.id) return

    const fetchProfile = async () => {
      try {
        const res = await apiClient.get(`/users/${authUser.id}`)

        setProfileUser(res.data.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [authUser])

  /**
   * Loading
   */
  if (loading) {
    return (
      <main className="mx-auto max-w-[1200px] p-4">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </main>
    )
  }

  /**
   * Error
   */
  if (!profileUser) {
    return <main className="p-10 text-center">Failed to load profile</main>
  }

  return (
    <main className="mx-auto max-w-[1200px] space-y-6 p-4">
      {/* HEADER */}
      <ProfileHeader
        user={{
          username: profileUser.username,

          name: profileUser.name,

          bio: profileUser.bio,

          profileImage: profileUser.profileImage,

          coverImage: profileUser.coverImage,

          followersCount: profileUser.followerCount,

          followingCount: profileUser.followingCount,

          postsCount: profileUser.postCount,
        }}
        onEdit={() => setOpen(true)}
      />

      {/* MODAL */}
      <EditProfileModal open={open} setOpen={setOpen} user={profileUser} />

      {/* GRID */}
      <div className="grid grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="col-span-3 hidden lg:block">
          <ProfileSidebar />
        </div>

        {/* CENTER */}
        <div className="col-span-12 space-y-4 lg:col-span-6">
          <ProfileTabs tab={tab} setTab={setTab} />

          {tab === "posts" && (
            <>
              <CreatePostBox />
              <FeedList />
            </>
          )}

          {tab === "photos" && (
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-32 rounded-lg bg-muted" />
              ))}
            </div>
          )}

          {tab === "saved" && (
            <div className="p-6 text-center text-muted-foreground">
              No saved posts yet
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div className="col-span-3 hidden lg:block" />
      </div>
    </main>
  )
}
