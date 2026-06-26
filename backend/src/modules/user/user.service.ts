import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { getFileUrl } from "../../shared/utils/getFileUrl";
import { UpdateProfileInput } from "./user.dto";
/**
 * ------------------------------------------------
 * User Service
 * ------------------------------------------------
 * Contains business logic related to user operations
 */

/**
 * ------------------------------------------------
 * User Service
 * ------------------------------------------------
 */

export const UserService = {

  /**
   * ------------------------------------------------
   * Get user profile
   * ------------------------------------------------
   */
  async getUserProfile(userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      posts: {
        include: { images: true },
      },
    },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  /**
   * Strip password before sending to client
   */
  const { password, ...safeUser } = user;

  const transformedPosts = user.posts.map((post) => ({
    ...post,
    images: post.images.map((image) => ({
      ...image,
      imageUrl: getFileUrl(image.imageUrl),
    })),
  }));

  
  return {
    ...safeUser,
    profileImage: getFileUrl(user.profileImage),
    coverImage: getFileUrl(user.coverImage),
    posts: transformedPosts,
  };
},

  /**
   * ------------------------------------------------
   * Update profile
   * ------------------------------------------------
   */
  async updateProfile(
    userId: number,
    data: UpdateProfileInput
  ) {

    const user = await prisma.user.update({
      where: { id: userId },

      data,
    });

    return {
      ...user,

      profileImage:
        getFileUrl(user.profileImage),

      coverImage:
        getFileUrl(user.coverImage),
    };
  },

  /**
   * ------------------------------------------------
   * Update avatar
   * ------------------------------------------------
   */
  async updateAvatar(
    userId: number,
    avatarUrl: string
  ) {

    const user = await prisma.user.update({
      where: { id: userId },

      data: {
        profileImage: avatarUrl,
      },
    });

    return {
      ...user,

      profileImage:
        getFileUrl(user.profileImage),

      coverImage:
        getFileUrl(user.coverImage),
    };
  },

  /**
   * ------------------------------------------------
   * Update cover
   * ------------------------------------------------
   */
  async updateCover(
    userId: number,
    coverUrl: string
  ) {

    const user = await prisma.user.update({
      where: { id: userId },

      data: {
        coverImage: coverUrl,
      },
    });

    return {
      ...user,

      profileImage:
        getFileUrl(user.profileImage),

      coverImage:
        getFileUrl(user.coverImage),
    };
  },

  /**
   * ------------------------------------------------
   * Get all users with follow status
   * ------------------------------------------------
   */
  async getAllUsers(
    currentUserId: number,
    query?: string
  ) {

    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query || "",
          mode: "insensitive",
        },

        NOT: {
          id: currentUserId,
        },
      },

      select: {
        id: true,
        username: true,
        profileImage: true,
        coverImage: true,
        bio: true,
      },
    });

    /**
     * Get following list
     */
    const following =
      await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
        },

        select: {
          followingId: true,
        },
      });

    const followingIds =
      new Set(
        following.map(
          (f) => f.followingId
        )
      );

    /**
     * Add isFollowing flag
     */
    return users.map((user) => ({
      ...user,

      profileImage:
        getFileUrl(user.profileImage),

      coverImage:
        getFileUrl(user.coverImage),

      isFollowing:
        followingIds.has(user.id),
    }));
  },

  /**
   * ------------------------------------------------
   * Get following users
   * ------------------------------------------------
   */
  async getFollowingUsers(
    currentUserId: number
  ) {

    const following =
      await prisma.follow.findMany({
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

    return following.map((f) => ({
      ...f.following,

      profileImage:
        getFileUrl(
          f.following.profileImage
        ),

      coverImage:
        getFileUrl(
          f.following.coverImage
        ),

      isFollowing: true,
    }));
  },

  /**
   * ------------------------------------------------
   * Get followers
   * ------------------------------------------------
   */
  async getFollowers(
    currentUserId: number
  ) {

    const followers =
      await prisma.follow.findMany({
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
     * Get my following list
     */
    const myFollowing =
      await prisma.follow.findMany({
        where: {
          followerId: currentUserId,
        },

        select: {
          followingId: true,
        },
      });

    const followingSet =
      new Set(
        myFollowing.map(
          (f) => f.followingId
        )
      );

    /**
     * Add follow status
     */
    return followers.map((f) => ({
      ...f.follower,

      profileImage:
        getFileUrl(
          f.follower.profileImage
        ),

      coverImage:
        getFileUrl(
          f.follower.coverImage
        ),

      isFollowing:
        followingSet.has(
          f.follower.id
        ),
    }));
  },
};