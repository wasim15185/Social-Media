import { AppError } from "../../shared/errors/AppError";
import { prisma } from "../../config/prisma";
import { getPagination } from "../../shared/utils/pagination";

/**
 * Post Service
 */

export const PostService = {
  /**
   * Create new post
   */
  async createPost(userId: number, content: string, images: string[]) {
    const post = await prisma.post.create({
      data: {
        content,
        authorId: userId,
        images: {
          create: images.map((img, index) => ({
            imageUrl: img,
            order: index,
          })),
        },
      },
      include: {
        images: true,
      },
    });

    return post;
  },

  /**
   * Get feed posts with pagination
   *
   * Pagination is important for social media feeds
   * because returning thousands of posts would slow
   * down the application.
   *
   * Example:
   * GET /api/posts/feed?page=1&limit=10
   */

  async getFeed(page: number, limit: number) {
   const { skip, take } = getPagination(page, limit);

   const posts = await prisma.post.findMany({
     skip,
     take,
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
     orderBy: {
       createdAt: "desc",
     },
   });

   return posts;
  },

  /**
   * Get single post
   */
  async getPostById(postId: number) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        images: true,
        comments: true,
        likes: true,
      },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    return post;
  },

  /**
   * Delete post
   */
  async deletePost(postId: number, userId: number) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("Not authorized to delete this post", 403);
    }

    await prisma.post.delete({
      where: { id: postId },
    });

    return true;
  },

  /**
   * Update post
   *
   * Only the post owner can update their post.
   */

  async updatePost(postId: number, userId: number, data: any) {
    /**
     * Find post first
     */
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    /**
     * Check ownership
     */
    if (post.authorId !== userId) {
      throw new AppError("Not authorized to edit this post", 403);
    }

    /**
     * Update post content
     */
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...data,
        isEdited: true,
      },
    });

    return updatedPost;
  },
};
