import { z } from "zod";

/**
 * Send Message Validation Schema
 * ------------------------------------------------
 * Ensures that the message body is valid before
 * it reaches the controller.
 */

export const sendMessageSchema = z.object({
  body: z.object({
    text: z.string().max(2000, "Message too long").optional(),

    mediaUrl: z.string().url("Invalid media URL").optional(),

    mediaType: z.enum(["IMAGE", "VIDEO"]).optional(),
  }),
});
