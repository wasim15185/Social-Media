import {prisma} from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

/**
 * Follow Service
 */

export const FollowService = {
  async toggleFollow(currentUserId: number, targetUserId: number) {
    if (currentUserId === targetUserId) {
      throw new AppError("You cannot follow yourself", 400);
    }

    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    /**
     * If already following → unfollow
     */
    if (existing) {
      await prisma.follow.delete({
        where: { id: existing.id },
      });

      await prisma.user.update({
        where: { id: targetUserId },
        data: {
          followerCount: { decrement: 1 },
        },
      });

      return { following: false };
    }

    /**
     * Otherwise follow
     */
    await prisma.follow.create({
      data: {
        followerId: currentUserId,
        followingId: targetUserId,
      },
    });

    await prisma.user.update({
      where: { id: targetUserId },
      data: {
        followerCount: { increment: 1 },
      },
    });

    return { following: true };
  },
};
