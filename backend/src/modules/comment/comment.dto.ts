import { z } from "zod";

/**
 * Create Comment Schema
 */

export const createCommentSchema = z.object({
  body: z.object({
    content: z.string().min(1, "Comment cannot be empty").max(500),
  }),
});
