import {prisma} from "../../config/prisma";

/**
 * Search Service
 * Handles searching users and posts
 */

export const SearchService = {
  /**
   * Search users by username
   */
 async searchUsers(query: string) {

  const searchQuery = query.trim();

  if (!searchQuery) {
    return [];
  }

  const users = await prisma.user.findMany({
    where: {
      OR: [
        {
          username: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
        {
          name: {
            contains: searchQuery,
            mode: "insensitive",
          },
        },
      ],
    },

    select: {
      id: true,
      name: true,
      username: true,
      profileImage: true,
    },

    take: 10,
  });

  return users;
},

  /**
   * Search posts by content
   */
  async searchPosts(query: string) {
    const posts = await prisma.post.findMany({
      where: {
        content: {
          contains: query,
          mode: "insensitive",
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
        images: true,
      },
      take: 10,
    });

    return posts;
  },
};
