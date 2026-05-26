import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { getFileUrl } from "../../shared/utils/getFileUrl";

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

    return {
      ...user,

      profileImage: getFileUrl(user.profileImage),

      coverImage: getFileUrl(user.coverImage),
    };
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
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        profileImage: avatarUrl,
      },
    });

    return {
      ...user,
      profileImage: getFileUrl(user.profileImage),
      coverImage: getFileUrl(user.coverImage),
    };
  },

  /**
   * Update cover photo
   */

  async updateCover(userId: number, coverUrl: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        coverImage: coverUrl,
      },
    });

    return {
      ...user,
      profileImage: getFileUrl(user.profileImage),
      coverImage: getFileUrl(user.coverImage),
    };
  },

  /**
   * ------------------------------------------------
   * Get all users with follow status
   * ------------------------------------------------
   */
  async getAllUsers(currentUserId: number, query?: string) {
    /**
     * Step 1: Get users (optional search)
     */
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query || "",
          mode: "insensitive",
        },
        NOT: {
          id: currentUserId, // exclude self
        },
      },
      select: {
        id: true,
        username: true,
        profileImage: true,
        coverImage: true,
      },
    });

    /**
     * Step 2: Get following list
     */
    const following = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });

    const followingIds = new Set(following.map((f) => f.followingId));

    /**
     * Step 3: Add isFollowing flag
     */
    return users.map((user) => ({
      ...user,

      profileImage: getFileUrl(user.profileImage),

      coverImage: getFileUrl(user.coverImage),

      isFollowing: followingIds.has(user.id),
    }));
  },

  /**
   * ------------------------------------------------
   * Get following users (friends list)
   * ------------------------------------------------
   */
  async getFollowingUsers(currentUserId: number) {
    /**
     * Step 1: Get follow relations
     */
    const following = await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
      },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            coverImage: true,
            bio: true,
          },
        },
      },
    });

    /**
     * Step 2: Format response
     */
   return following.map((f) => ({
     ...f.following,

     profileImage: getFileUrl(f.following.profileImage),

     coverImage: getFileUrl(f.following.coverImage),

     isFollowing: true,
   }));
  },

  /**
   * ------------------------------------------------
   * Get followers (users who follow the current user)
   * ------------------------------------------------
   *
   * Logic:
   * - Find all follow records where:
   *   followingId = currentUserId
   * - Include follower user details
   * - Return clean user list
   */

  async getFollowers(currentUserId: number) {
    /**
     * Step 1: Get followers
     */
    const followers = await prisma.follow.findMany({
      where: {
        followingId: currentUserId,
      },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            profileImage: true,
            coverImage: true,
            bio: true,
          },
        },
      },
    });

    /**
     * Step 2: Get who I follow (IMPORTANT)
     */
    const myFollowing = await prisma.follow.findMany({
      where: { followerId: currentUserId },
      select: { followingId: true },
    });

    const followingSet = new Set(myFollowing.map((f) => f.followingId));

    /**
     * Step 3: Add isFollowing flag
     */
    return followers.map((f) => ({
      ...f.follower,

      profileImage: getFileUrl(f.follower.profileImage),

      coverImage: getFileUrl(f.follower.coverImage),

      isFollowing: followingSet.has(f.follower.id),
    }));
  },





  
};
