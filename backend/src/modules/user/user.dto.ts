import { z } from "zod";

/**
 * Update Profile Schema
 */
export const updateProfileSchema = z.object({
  body: z.object({
    bio: z.string().max(160).optional(),
    profileImage: z.string().optional(),
    coverImage: z.string().optional()
  })
});