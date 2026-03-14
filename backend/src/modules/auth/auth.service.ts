import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { generateToken } from "../../shared/utils/jwt";
import { Prisma } from "../../generated/prisma/client";
/**
 * Auth Service
 * Handles user registration and login
 */

export const AuthService = {
  /**
   * Register user
   */
  async register(data: {
    name: string;
    username: string;
    email: string;
    password: string;
  }) {
    const { name, username, email, password } = data;

    /**
     * Check if email or username already exists
     */
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      if (existingUser.email === email) {
        throw new AppError("Email already registered", 400);
      }

      if (existingUser.username === username) {
        throw new AppError("Username already taken", 400);
      }
    }

    /**
     * Hash password
     */
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      /**
       * Create user
       */
      const user = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
        },
      });

      /**
       * Generate JWT
       */
      const token = generateToken({ userId: user.id });

      return {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
        },
        token,
      };
    } catch (error: any) {
      /**
       * Prisma unique constraint protection
       */
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        const field = (error.meta?.target as string[])[0];

        if (field === "email") {
          throw new AppError("Email already registered", 400);
        }

        if (field === "username") {
          throw new AppError("Username already taken", 400);
        }
      }

      throw error;
    }
  },

  /**
   * Login user
   */
  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    /**
     * Find user by email
     */
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    /**
     * Compare password
     */
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AppError("Invalid email or password", 401);
    }

    /**
     * Generate token
     */
    const token = generateToken({ userId: user.id });

    return {
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
      token,
    };
  },
};