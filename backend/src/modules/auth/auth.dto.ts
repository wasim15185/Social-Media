import { z } from "zod";

/**
 * Register User Schema
 * ---------------------------------------------------------
 * This schema defines the structure and validation rules
 * for the user registration request.
 *
 * Fields:
 * - username: required string (min length 3)
 * - email: must be valid email format
 * - password: minimum 6 characters
 */

 
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),

    email: z.string().email("Invalid email address"),

    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});

/**
 * Login validation schema
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),

    password: z.string().min(6),
  }),
});