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

  async getFeed(page: number, limit: number) {
    /**
     * Calculate pagination
     */
    const { skip, take } = getPagination(page, limit);

    /**
     * Fetch posts from database
     */
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
 
    /**
     * Convert image paths
     */
    const formattedPosts = posts.map((post) => {
      /**
       * Transform each image inside the post
       */
      const formattedImages = post.images.map((img) => {
        /**
         * Check if image is a local upload
         * Local uploads start with "/uploads"
         */
        if (img.imageUrl.startsWith("/uploads")) {
          return {
            ...img,
            imageUrl: `${process.env.SERVER_BASE_URL}:${process.env.SERVER_PORT}${img.imageUrl}`,
          };
        }

        /**
         * If it's an external URL (picsum, cloudinary, etc.)
         * return it unchanged
         */
        return img;
      });

    
      /**
       * Return updated post
       */
      return {
        ...post,
        images: formattedImages,
      };
    });

    console.log("Formatted Posts:", formattedPosts);

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
