import { AppError } from "../../shared/errors/AppError";
import { prisma } from "../../config/prisma";

/**
 * User Service
 * Handles all business logic related to users
 */

export const UserService = {
  /**
   * Get user profile by id
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
   * Update user profile
   */
  async updateProfile(userId: number, data: any) {
    const user = await prisma.user.update({
      where: { id: userId },
      data,
    });

    return user;
  },
};
