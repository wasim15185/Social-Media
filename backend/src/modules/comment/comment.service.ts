import {prisma} from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";

/**
 * Comment Service
 */

export const CommentService = {
  /**
   * Create comment
   */
  async createComment(userId: number, postId: number, content: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      throw new AppError("Post not found", 404);
    }

    const comment = await prisma.comment.create({
      data: {
        content,
        userId,
        postId,
      },
    });

    /**
     * Update comment count
     */
    await prisma.post.update({
      where: { id: postId },
      data: {
        commentCount: {
          increment: 1,
        },
      },
    });

    return comment;
  },

  /**
   * Get comments of post
   */
  async getPostComments(postId: number) {
    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profileImage: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return comments;
  },

  /**
   * Delete comment
   */
  async deleteComment(commentId: number, userId: number) {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    });

    if (!comment) {
      throw new AppError("Comment not found", 404);
    }

    if (comment.userId !== userId) {
      throw new AppError("Not authorized", 403);
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });

    await prisma.post.update({
      where: { id: comment.postId },
      data: {
        commentCount: {
          decrement: 1,
        },
      },
    });

    return true;
  },
};
