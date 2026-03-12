import { Server, Socket } from "socket.io";
import { prisma } from "../config/prisma";
import { MessageStatus } from "./../generated/prisma/browser";
import { logger } from "../shared/utils/logger";

/**
 * Chat Socket Handler
 * -------------------------------------------------------
 * This module manages all real-time chat communication.
 *
 * Responsibilities:
 * - Manage socket connections
 * - Join user rooms
 * - Join conversation rooms
 * - Send and receive messages
 * - Update message status
 * - Handle typing indicators
 * - Track online/offline users
 *
 * Socket.IO is used as the real-time transport layer.
 */

export const chatSocket = (io: Server) => {
  /**
   * Triggered when a new client connects
   */
  io.on("connection", (socket: Socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    /**
     * ----------------------------------------------------
     * Join User Room
     * ----------------------------------------------------
     * Each user joins a private socket room.
     *
     * This allows sending events directly to that user.
     *
     * Example room:
     * user_5
     */
    socket.on("join-user", (userId: number) => {
      const room = `user_${userId}`;

      socket.join(room);

      logger.info(`User ${userId} joined room ${room}`);

      /**
       * Notify other users that this user is online
       */
      socket.broadcast.emit("user-online", { userId });
    });

    /**
     * ----------------------------------------------------
     * Join Conversation Room
     * ----------------------------------------------------
     * When a user opens a chat conversation,
     * they join a room dedicated to that conversation.
     *
     * Example:
     * conversation_12
     */
    socket.on("join-conversation", (conversationId: number) => {
      const room = `conversation_${conversationId}`;

      socket.join(room);

      logger.info(`Socket joined conversation ${conversationId}`);
    });

    /**
     * ----------------------------------------------------
     * Send Message
     * ----------------------------------------------------
     * When a user sends a message:
     *
     * 1. Save message in database
     * 2. Update unread message count
     * 3. Broadcast message to conversation participants
     */
    socket.on("send-message", async (data) => {
      try {
        const { senderId, conversationId, text, mediaUrl, mediaType } = data;

        /**
         * Save message to database
         */
        const message = await prisma.message.create({
          data: {
            senderId,
            conversationId,
            text,
            mediaUrl,
            mediaType,
            status: MessageStatus.SENT,
          },
          include: {
            sender: {
              select: {
                id: true,
                username: true,
                profileImage: true,
              },
            },
          },
        });

        /**
         * Increase unread count for other participants
         */
        await prisma.conversationParticipant.updateMany({
          where: {
            conversationId,
            NOT: {
              userId: senderId,
            },
          },
          data: {
            unreadCount: {
              increment: 1,
            },
          },
        });

        /**
         * Emit message to all users in this conversation
         */
        io.to(`conversation_${conversationId}`).emit(
          "receive-message",
          message,
        );

        /**
         * Update conversation preview for sidebar
         */
        io.to(`conversation_${conversationId}`).emit("conversation-updated", {
          conversationId,
        });
      } catch (error) {
        logger.error(error,"Socket message error");
      }
    });

    /**
     * ----------------------------------------------------
     * Typing Indicator
     * ----------------------------------------------------
     * Shows "User is typing..."
     */
    socket.on("typing", ({ conversationId, userId }) => {
      socket.to(`conversation_${conversationId}`).emit("typing", { userId });
    });

    /**
     * ----------------------------------------------------
     * Stop Typing
     * ----------------------------------------------------
     */
    socket.on("stop-typing", ({ conversationId, userId }) => {
      socket
        .to(`conversation_${conversationId}`)
        .emit("stop-typing", { userId });
    });

    /**
     * ----------------------------------------------------
     * Message Delivered
     * ----------------------------------------------------
     * Triggered when receiver gets the message.
     */
    socket.on("message-delivered", async ({ messageId }) => {
      try {
        const message = await prisma.message.update({
          where: { id: messageId },
          data: {
            status: MessageStatus.DELIVERED,
          },
        });

        io.emit("message-delivered", message);
      } catch (error) {
        logger.error(error,"Delivery status error");
      }
    });

    /**
     * ----------------------------------------------------
     * Message Read
     * ----------------------------------------------------
     * Triggered when receiver opens the chat.
     */
    socket.on("message-read", async ({ messageId }) => {
      try {
        const message = await prisma.message.update({
          where: { id: messageId },
          data: {
            status: MessageStatus.READ,
          },
        });

        io.emit("message-read", message);
      } catch (error) {
        logger.error(error,"Read status error");
      }
    });

    /**
     * ----------------------------------------------------
     * Disconnect
     * ----------------------------------------------------
     * Triggered when user disconnects.
     */
    socket.on("disconnect", () => {
      logger.info(`Socket disconnected: ${socket.id}`);

      /**
       * Notify other users that user went offline
       */
      socket.broadcast.emit("user-offline");
    });
  });
};
