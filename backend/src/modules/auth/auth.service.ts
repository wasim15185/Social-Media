import bcrypt from "bcrypt";
import { prisma } from "../../config/prisma";
import { AppError } from "../../shared/errors/AppError";
import { generateToken } from "../../shared/utils/jwt";

/**
 * AuthService using Prisma ORM
 */

export const AuthService = {
  async register(data: any) {
    const { username, email, password } = data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    const token = generateToken({ userId: user.id });

    return { user, token };
  },

  async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = generateToken({ userId: user.id });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    };
  },
};