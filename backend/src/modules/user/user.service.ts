import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

/**
 * ------------------------------------------------
 * User Service
 * ------------------------------------------------
 * Contains business logic related to user operations
 */

export const UserService = {
  /**
   * Get user profile
   */

  async getUserProfile(userId: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        posts: {
          include: {
            images: true,
          },
        },
      },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    return user;
  },

  /**
   * Update profile fields
   */

  async updateProfile(userId: number, data: any) {
    return prisma.user.update({
      where: { id: userId },
      data,
    });
  },

  /**
   * Update avatar
   */

  async updateAvatar(userId: number, avatarUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: avatarUrl,
      },
    });
  },

  /**
   * Update cover photo
   */

  async updateCover(userId: number, coverUrl: string) {
    return prisma.user.update({
      where: { id: userId },
      data: {
        coverImage: coverUrl,
      },
    });
  },
};
