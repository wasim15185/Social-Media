import { prisma } from "../../../config/prisma";
import { AppError } from "../../../shared/errors/AppError";

/**
 * Saved Post Service
 *
 * Handles saving and unsaving posts.
 */

export const SavedPostService = {
  /**
   * Toggle save post
   */
  async toggleSavePost(userId: number, postId: number) {
    const existing = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
    });

    /**
     * If already saved → unsave
     */
    if (existing) {
      await prisma.savedPost.delete({
        where: { id: existing.id },
      });

      return { saved: false };
    }

    /**
     * Otherwise save post
     */
    await prisma.savedPost.create({
      data: {
        userId,
        postId,
      },
    });

    return { saved: true };
  },

  /**
   * Get saved posts
   */
  async getSavedPosts(userId: number) {
    const savedPosts = await prisma.savedPost.findMany({
      where: { userId },

      include: {
        post: {
          include: {
            author: {
              select: {
                id: true,
                username: true,
                profileImage: true,
              },
            },
            images: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return savedPosts;
  },
};
