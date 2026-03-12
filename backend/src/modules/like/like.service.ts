import {prisma} from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

/**
 * Like Service
 * Handles post like/unlike logic
 */

export const LikeService = {
  /**
   * Toggle like
   */
  async toggleLike(postId: number, userId: number) {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    /**
     * If already liked → unlike
     */
    if (existingLike) {
      await prisma.like.delete({
        where: { id: existingLike.id },
      });

      await prisma.post.update({
        where: { id: postId },
        data: {
          likeCount: {
            decrement: 1,
          },
        },
      });

      return { liked: false };
    }

    /**
     * Otherwise → create like
     */
    await prisma.like.create({
      data: {
        postId,
        userId,
      },
    });

    await prisma.post.update({
      where: { id: postId },
      data: {
        likeCount: {
          increment: 1,
        },
      },
    });

    return { liked: true };
  },
};
