import { Server, Socket } from "socket.io";
import { logger } from "../shared/utils/logger";

/**
 * Notification Socket
 * ------------------------------------------------
 * Handles real-time notification events.
 *
 * Responsibilities:
 * - User joins notification room
 * - Receive real-time notifications
 */

export const notificationSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    /**
     * Join notification room
     * Each user gets a private notification room
     *
     * Example:
     * user_5
     */
    socket.on("join-notifications", (userId: number) => {
      const room = `user_${userId}`;

      socket.join(room);

      logger.info(`User ${userId} joined notification room`);
    });
  });
};
