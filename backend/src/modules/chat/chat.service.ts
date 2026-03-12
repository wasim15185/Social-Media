import { prisma } from "../../config/prisma";
import { MediaType, MessageStatus } from "../../generated/prisma/browser";
import { AppError } from "../../shared/errors/AppError";
import { getIO } from "../../realtime/socket";

/**
 * Chat Service
 * --------------------------------------------------------
 * This service handles all database operations related
 * to chat functionality.
 *
 * Responsibilities:
 * - Create conversations
 * - Fetch user conversations
 * - Fetch messages
 * - Send messages
 * - Maintain unread message counters
 * - Update message status
 * - Emit real-time socket events
 */

export const ChatService = {

  /**
   * --------------------------------------------------------
   * Create Conversation
   * --------------------------------------------------------
   * Creates a conversation between two users.
   *
   * If a conversation already exists between these users,
   * the existing conversation will be returned.
   *
   * Example:
   * user 1 → starts chat with user 5
   */
  async createConversation(userId: number, targetUserId: number) {

    /**
     * Prevent user from chatting with themselves
     */
    if (userId === targetUserId) {
      throw new AppError("Cannot create conversation with yourself", 400);
    }

    /**
     * Check if conversation already exists
     */
    const existing = await prisma.conversation.findFirst({
      where: {
        AND: [
          {
            participants: {
              some: { userId }
            }
          },
          {
            participants: {
              some: { userId: targetUserId }
            }
          }
        ]
      },
      include: {
        participants: true
      }
    });

    if (existing) {
      return existing;
    }

    /**
     * Create new conversation
     */
    const conversation = await prisma.conversation.create({
      data: {
        participants: {
          create: [
            { userId },
            { userId: targetUserId }
          ]
        }
      },
      include: {
        participants: true
      }
    });

    return conversation;
  },



  /**
   * --------------------------------------------------------
   * Get User Conversations
   * --------------------------------------------------------
   * Returns all conversations where the user participates.
   *
   * Includes:
   * - conversation participants
   * - last message preview
   * - participant user info
   */
  async getUserConversations(userId: number) {

    return prisma.conversation.findMany({

      where: {
        participants: {
          some: { userId }
        }
      },

      include: {

        /**
         * Include participants and user info
         */
        participants: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                profileImage: true
              }
            }
          }
        },

        /**
         * Include latest message for preview
         */
        messages: {
          orderBy: {
            createdAt: "desc"
          },
          take: 1
        }

      },

      orderBy: {
        createdAt: "desc"
      }

    });

  },



  /**
   * --------------------------------------------------------
   * Get Messages
   * --------------------------------------------------------
   * Fetch messages for a conversation.
   *
   * When a user opens the conversation:
   * - unread message counter resets to 0
   */
  async getMessages(conversationId: number, userId: number) {

    /**
     * Reset unread counter for this user
     */
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        userId
      },
      data: {
        unreadCount: 0
      }
    });

    /**
     * Fetch messages
     */
    return prisma.message.findMany({

      where: { conversationId },

      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        }
      },

      orderBy: {
        createdAt: "asc"
      }

    });

  },



  /**
   * --------------------------------------------------------
   * Send Message
   * --------------------------------------------------------
   * Creates a message and updates unread counts.
   *
   * Also emits a real-time socket event so the
   * receiver instantly receives the message.
   *
   * Supports:
   * - text messages
   * - image messages
   * - video messages
   */
  async sendMessage(
    senderId: number,
    conversationId: number,
    text?: string,
    mediaUrl?: string,
    mediaType?: MediaType
  ) {

    /**
     * Create message in database
     */
    const message = await prisma.message.create({
      data: {
        senderId,
        conversationId,
        text,
        mediaUrl,
        mediaType,
        status: MessageStatus.SENT
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        }
      }
    });


    /**
     * Increase unread message count
     * for other participants
     */
    await prisma.conversationParticipant.updateMany({
      where: {
        conversationId,
        NOT: {
          userId: senderId
        }
      },
      data: {
        unreadCount: {
          increment: 1
        }
      }
    });


    /**
     * ------------------------------------------------
     * Emit real-time message event
     * ------------------------------------------------
     */
    const io = getIO();

    io.to(`conversation_${conversationId}`)
      .emit("receive-message", message);


    /**
     * Emit conversation update event
     * (used to refresh sidebar previews)
     */
    io.to(`conversation_${conversationId}`)
      .emit("conversation-updated", {
        conversationId
      });

    return message;
  },



  /**
   * --------------------------------------------------------
   * Mark Message Delivered
   * --------------------------------------------------------
   * Called when receiver receives message.
   */
  async markDelivered(messageId: number) {

    return prisma.message.update({
      where: { id: messageId },
      data: {
        status: MessageStatus.DELIVERED
      }
    });

  },



  /**
   * --------------------------------------------------------
   * Mark Message Read
   * --------------------------------------------------------
   * Called when receiver opens the chat.
   */
  async markRead(messageId: number) {

    return prisma.message.update({
      where: { id: messageId },
      data: {
        status: MessageStatus.READ
      }
    });

  }

};