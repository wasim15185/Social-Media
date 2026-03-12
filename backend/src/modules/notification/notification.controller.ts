import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { NotificationService } from "./notification.service";

/**
 * Notification Controller
 */

export const NotificationController = {
  /**
   * Get notifications
   */
  getNotifications: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const notifications =
      await NotificationService.getUserNotifications(userId);

    sendResponse(res, 200, "Notifications fetched successfully", notifications);
  }),

  /**
   * Mark notification as read
   */
  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const notificationId = Number(req.params.id);

    const notification = await NotificationService.markAsRead(
      notificationId,
      userId,
    );

    sendResponse(res, 200, "Notification marked as read", notification);
  }),
};
