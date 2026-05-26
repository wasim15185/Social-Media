import { z } from "zod";

/**
 * ------------------------------------------------
 * Update Profile Schema
 * ------------------------------------------------
 */

export const updateProfileSchema = z.object({
  body: z.object({
    /**
     * Full name
     */
    name: z.string().min(2).max(50).optional(),

    /**
     * User bio
     */
    bio: z.string().max(160).optional(),
  }),
});

/**
 * ------------------------------------------------
 * Update Profile Input Type
 * ------------------------------------------------
 */

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>["body"];
