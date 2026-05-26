import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

/**
 * ------------------------------------------------
 * Follow Service
 * ------------------------------------------------
 * Handles:
 * - Follow user
 * - Unfollow user
 * - Toggle follow state
 *
 * Business rules:
 * - User cannot follow themselves
 * - Target user must exist
 * - Follow relationship must be unique
 * - Operations must be atomic (transaction)
 * ------------------------------------------------
 */

export const FollowService = {
  async toggleFollow(currentUserId: number, targetUserId: number) {
    /**
     * Prevent self-follow
     */
    if (currentUserId === targetUserId) {
      throw new AppError("You cannot follow yourself", 400);
    }

    /**
     * Check if target user exists
     */
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
    });

    if (!targetUser) {
      throw new AppError("User not found", 404);
    }

    /**
     * Check existing follow
     */
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      },
    });

    /**
     * Use transaction for consistency
     */
    return prisma.$transaction(async (tx) => {
      /**
       * UNFOLLOW
       */
      if (existing) {
        await tx.follow.delete({
          where: {
            followerId_followingId: {
              followerId: currentUserId,
              followingId: targetUserId,
            },
          },
        });

        await tx.user.update({
          where: { id: targetUserId },
          data: {
            followerCount: {
              decrement: 1,
            },
          },
        });

        return {
          following: false,
        };
      }

      /**
       * FOLLOW
       */
      await tx.follow.create({
        data: {
          followerId: currentUserId,
          followingId: targetUserId,
        },
      });

      await tx.user.update({
        where: { id: targetUserId },
        data: {
          followerCount: {
            increment: 1,
          },
        },
      });

      return {
        following: true,
      };
    });
  },



  
};
