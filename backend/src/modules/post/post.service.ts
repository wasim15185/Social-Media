import { AppError } from "../../shared/errors/AppError";
import { prisma } from "../../config/prisma";
import { getPagination } from "../../shared/utils/pagination";
import path from "path";
import fs from "fs";

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
   * ------------------------------------------------
   * Get Feed Posts with Pagination
   * ------------------------------------------------
   * This method returns posts with author + images.
   *
   * It also converts local image paths into full URLs
   * so frontend can load them correctly.
   *
   * Example transformation:
   *
   * DB value:
   *   /uploads/users/wasim_31/posts/img.jpg
   *
   * API response:
   *   http://localhost:5000/uploads/users/wasim_31/posts/img.jpg
   *
   * BUT external images like:
   *   https://picsum.photos/...
   * remain unchanged.
   * ------------------------------------------------
   */

  async getFeed(userId: number, page: number, limit: number) {
    /**
     * ------------------------------------------------
     * Helper Function
     * ------------------------------------------------
     */
    const buildFileUrl = (path?: string | null) => {
      if (!path) return null;

      return path.startsWith("/uploads")
        ? `${process.env.SERVER_BASE_URL}:${process.env.SERVER_PORT}${path}`
        : path;
    };

    /**
     * ------------------------------------------------
     * Step 1: Pagination
     * ------------------------------------------------
     */
    const { skip, take } = getPagination(page, limit);

    /**
     * ------------------------------------------------
     * Step 2: Get following users
     * ------------------------------------------------
     */
    const following = await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        followingId: true,
      },
    });

    /**
     * Extract IDs
     */
    const followingIds = following.map((f) => f.followingId);

    /**
     * Include self posts also
     */
    const authorIds = [...followingIds, userId];

    /**
     * ------------------------------------------------
     * Step 3: Fetch Posts
     * ------------------------------------------------
     */
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          in: authorIds,
        },
      },
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

    /**
     * ------------------------------------------------
     * Step 4: Format URLs
     * ------------------------------------------------
     */
    const formattedPosts = posts.map((post) => ({
      ...post,

      author: {
        ...post.author,
        profileImage: buildFileUrl(post.author.profileImage),
      },

      images: post.images.map((img) => ({
        ...img,
        imageUrl: buildFileUrl(img.imageUrl),
      })),
    }));

    return formattedPosts;
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
      include: { images: true },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("Not authorized to delete this post", 403);
    }

    /**
     * Remove images from disk
     */
    for (const image of post.images) {
      const filePath = path.join(process.cwd(), image.imageUrl);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    /**
     * Delete post (cascade removes PostImage rows)
     */
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

  async updatePost(
    postId: number,
    userId: number,
    data: { content?: string; keepImageIds?: number[]; newImages?: string[] },
  ) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      include: { images: true },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    if (post.authorId !== userId) {
      throw new AppError("Not authorized to edit this post", 403);
    }

    const { content, keepImageIds, newImages } = data;

    /**
     * Step 1: যেই image গুলো keepImageIds এ নেই, সেগুলো delete করো
     */
    if (keepImageIds !== undefined) {
      const imagesToDelete = post.images.filter(
        (img) => !keepImageIds.includes(img.id),
      );

      for (const image of imagesToDelete) {
        const filePath = path.join(process.cwd(), image.imageUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      if (imagesToDelete.length > 0) {
        await prisma.postImage.deleteMany({
          where: { id: { in: imagesToDelete.map((img) => img.id) } },
        });
      }
    }

    /**
     * Step 2: নতুন image গুলো add করো
     */
    if (newImages && newImages.length > 0) {
      const startOrder = keepImageIds
        ? keepImageIds.length
        : post.images.length;

      await prisma.postImage.createMany({
        data: newImages.map((img, index) => ({
          postId,
          imageUrl: img,
          order: startOrder + index,
        })),
      });
    }

    /**
     * Step 3: content আপডেট করো
     */
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...(content !== undefined ? { content } : {}),
        isEdited: true,
      },
      include: { images: true },
    });

    return updatedPost;
  },
};
