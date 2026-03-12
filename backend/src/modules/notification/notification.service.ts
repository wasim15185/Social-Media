import {prisma} from "../../config/prisma";
import { NotificationType } from "../../generated/prisma/browser";
import { AppError } from "../../shared/errors/AppError";
import { getIO } from "../../realtime/socket";

/**
 * Notification Service
 * -------------------------------------------------------
 * This service handles all operations related to
 * user notifications.
 *
 * Responsibilities:
 * - Create notifications
 * - Fetch user notifications
 * - Mark notifications as read
 * - Emit real-time notification events via Socket.IO
 */

export const NotificationService = {

  /**
   * -------------------------------------------------------
   * Create Notification
   * -------------------------------------------------------
   * This method is used by other modules such as:
   * - like.service.ts
   * - comment.service.ts
   * - follow.service.ts
   *
   * Example:
   * User A likes User B's post
   * → Notification created for User B
   */
  async createNotification(
    senderId: number,
    receiverId: number,
    type: NotificationType,
    postId?: number
  ) {

    /**
     * Prevent self-notifications
     * Example:
     * User liking their own post should not create a notification
     */
    if (senderId === receiverId) {
      return null;
    }

    /**
     * Create notification in database
     */
    const notification = await prisma.notification.create({
      data: {
        senderId,
        receiverId,
        type,
        postId
      },
      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        },
        post: {
          select: {
            id: true
          }
        }
      }
    });


    /**
     * -------------------------------------------------------
     * Emit real-time notification event
     * -------------------------------------------------------
     * Send notification instantly to the receiver
     */
    const io = getIO();

    io.to(`user_${receiverId}`).emit(
      "new-notification",
      notification
    );

    return notification;
  },



  /**
   * -------------------------------------------------------
   * Get User Notifications
   * -------------------------------------------------------
   * Returns all notifications received by a user.
   *
   * Includes:
   * - sender information
   * - related post (if exists)
   */
  async getUserNotifications(userId: number) {

    const notifications = await prisma.notification.findMany({

      where: {
        receiverId: userId
      },

      include: {
        sender: {
          select: {
            id: true,
            username: true,
            profileImage: true
          }
        },
        post: {
          select: {
            id: true
          }
        }
      },

      orderBy: {
        createdAt: "desc"
      }

    });

    return notifications;
  },



  /**
   * -------------------------------------------------------
   * Mark Notification as Read
   * -------------------------------------------------------
   * Allows a user to mark their notification as read.
   *
   * Security:
   * Ensures the user owns the notification.
   */
  async markAsRead(notificationId: number, userId: number) {

    /**
     * Check if notification exists
     */
    const notification = await prisma.notification.findUnique({
      where: { id: notificationId }
    });

    if (!notification) {
      throw new AppError("Notification not found", 404);
    }

    /**
     * Ensure notification belongs to this user
     */
    if (notification.receiverId !== userId) {
      throw new AppError("Not authorized to update this notification", 403);
    }

    /**
     * Update notification status
     */
    const updatedNotification = await prisma.notification.update({
      where: { id: notificationId },
      data: {
        isRead: true
      }
    });

    return updatedNotification;
  }

};