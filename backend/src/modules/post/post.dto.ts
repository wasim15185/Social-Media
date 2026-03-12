import { z } from "zod";

/**
 * Create Post Schema
 */

export const createPostSchema = z.object({
  body: z.object({
    content: z.string().max(500).optional(),
  }),
});


/**
 * Update Post Schema
 */
export const updatePostSchema = z.object({
  body: z.object({
    content: z
      .string()
      .min(1)
      .max(500)
      .optional()
  })
});