import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { CommentService } from "./comment.service";

/**
 * Comment Controller
 */

export const CommentController = {
  createComment: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const postId = Number(req.params.postId);

    const comment = await CommentService.createComment(
      userId,
      postId,
      req.body.content,
    );

    sendResponse(res, 201, "Comment created", comment);
  }),

  getComments: asyncHandler(async (req: Request, res: Response) => {
    const postId = Number(req.params.postId);

    const comments = await CommentService.getPostComments(postId);

    sendResponse(res, 200, "Comments fetched", comments);
  }),

  deleteComment: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const commentId = Number(req.params.id);

    await CommentService.deleteComment(commentId, userId);

    sendResponse(res, 200, "Comment deleted");
  }),
};
