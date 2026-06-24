"use client"

import { useEffect, useState } from "react"

import { useAuthStore } from "@/store/auth-store"

import { apiClient } from "@/lib/network/api-client"

import { ProfileHeader } from "@/components/profile/profile-header"
import { ProfileSidebar } from "@/components/profile/profile-sidebar"
import { ProfileTabs } from "@/components/profile/profile-tabs"
import { ProfilePostList } from "@/components/profile/profile-post-list"
import { useParams } from "next/navigation"
import { UserResponseType } from "@/types/user.type"

import Image from "next/image"

type Props = {
  params: {
    userId: string
  }
}

export default function ProfilePage() {
  const [tab, setTab] = useState<"posts" | "photos" | "saved">("posts")

  const [profileUser, setProfileUser] = useState<UserResponseType | null>(null)

  const [loading, setLoading] = useState(true)

  const authUser = useAuthStore((state) => state.user)

  const params = useParams()
  const userId = params.userId as string

  useEffect(() => {
    const fetchProfile = async () => {

       
      try {
        const res = await apiClient.get(`/users/${userId}`)
 
        setProfileUser(res.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  if (loading) {
    return (
      <main className="mx-auto max-w-[1200px] p-4">
        <div className="h-64 animate-pulse rounded-2xl bg-muted" />
      </main>
    )
  }

  if (!profileUser) {
    return <main className="p-10 text-center">Failed to load profile</main>
  }

  return (
    <main className="mx-auto max-w-[1200px] space-y-6 p-4">
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
        isOwner={authUser?.id === profileUser.id}
        onEdit={() => {}}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 hidden lg:block">
          <ProfileSidebar />
        </div>

        <div className="col-span-12 space-y-4 lg:col-span-6">
          <ProfileTabs tab={tab} setTab={setTab} />

          {tab === "posts" && (
            <ProfilePostList
              posts={profileUser.posts}
              username={profileUser.username}
              profileImage={profileUser.profileImage}
              currentUserId={authUser?.id || -2}
            />
          )}

          {tab === "photos" && (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {profileUser.posts
                .flatMap((post) => post.images)
                .map((image) => (
                  <div
                    key={image.id}
                    className="relative aspect-square overflow-hidden rounded-xl border"
                  >
                    <Image
                      src={image.imageUrl}
                      alt="Post Image"
                      fill
                      sizes="(max-width:768px) 50vw, 33vw"
                      className="object-cover transition duration-300 hover:scale-105"
                    />
                  </div>
                ))}
            </div>
          )}

          {tab === "saved" && (
            <div className="rounded-xl border p-10 text-center text-muted-foreground">
              No saved posts yet
            </div>
          )}
        </div>

        <div className="col-span-3 hidden lg:block" />
      </div>
    </main>
  )
}
