"use client"

import { Button } from "@/components/ui/button"
import { useFollow } from "@/hooks/use-follow"

type Props = {
  userId: number
  isFollowing: boolean
  onChange?: (state: boolean) => void
}

export const FollowButton = ({ userId, isFollowing, onChange }: Props) => {
  const {
    isFollowing: following,
    toggleFollow,
    loading,
  } = useFollow(userId, isFollowing)

  const handleClick = async () => {
    const newState = await toggleFollow()
    if (newState !== undefined) {
      onChange?.(newState)
    }
  }

  return (
    <Button
      size="sm"
      variant={following ? "secondary" : "default"}
      onClick={handleClick}
      disabled={loading}
      className="h-8 px-3 text-xs"
    >
      {following ? "Following" : "Follow"}
    </Button>
  )
}
