import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

/**
 * Story Service
 * Handles story logic
 */

export const StoryService = {
  /**
   * Create story
   */
  async createStory(userId: number, imageUrl: string) {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const story = await prisma.story.create({
      data: {
        authorId: userId,
        imageUrl,
        expiresAt,
      },
    });

    return story;
  },

  /**
   * Get story feed
   * Only active stories
   */
  async getStories() {
    const stories = await prisma.story.findMany({
      where: {
        expiresAt: {
          gt: new Date(),
        },
      },

      include: {
        author: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },

      orderBy: {
        createdAt: "desc",
      },
    });

    return stories;
  },

  /**
   * View story
   */
  async viewStory(storyId: number, userId: number) {
    const story = await prisma.story.findUnique({
      where: { id: storyId },
    });

    if (!story) {
      throw new AppError("Story not found", 404);
    }

    await prisma.storyView.upsert({
      where: {
        storyId_userId: {
          storyId,
          userId,
        },
      },
      update: {},
      create: {
        storyId,
        userId,
      },
    });

    return { viewed: true };
  },
};
