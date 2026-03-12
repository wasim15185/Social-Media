import { Request, Response } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler";
import { sendResponse } from "../../shared/utils/sendResponse";
import { ChatService } from "./chat.service";

/**
 * Chat Controller
 * -------------------------------------------------------
 * The controller layer handles HTTP requests and responses.
 * It receives validated data from routes and forwards
 * the business logic to the service layer.
 *
 * Responsibilities:
 * - extract request parameters
 * - call service methods
 * - return standardized API responses
 *
 * Business logic is NOT written here.
 * It stays inside chat.service.ts
 */

export const ChatController = {
  /**
   * -------------------------------------------------------
   * Create Conversation
   * -------------------------------------------------------
   * Creates a conversation between the authenticated user
   * and another user (targetUserId).
   *
   * If a conversation already exists between these users,
   * the existing conversation will be returned.
   *
   * Endpoint:
   * POST /api/chat/conversation
   *
   * Request Body:
   * {
   *   "targetUserId": 2
   * }
   *
   * Authentication required.
   */
  createConversation: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Auth middleware attaches user object to request.
     * We extract the current authenticated user's ID.
     */
    const userId = req.user!.id;

    /**
     * targetUserId is the user we want to chat with
     */
    const { targetUserId } = req.body;

    /**
     * Call service layer
     */
    const conversation = await ChatService.createConversation(
      userId,
      targetUserId,
    );

    /**
     * Send standardized API response
     */
    sendResponse(res, 201, "Conversation created successfully", conversation);
  }),

  /**
   * -------------------------------------------------------
   * Get User Conversations
   * -------------------------------------------------------
   * Returns all conversations where the authenticated user
   * is a participant.
   *
   * Each conversation includes:
   * - participants (users)
   * - last message preview
   *
   * Endpoint:
   * GET /api/chat/conversations
   *
   * Authentication required.
   */
  getConversations: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Extract current user
     */
    const userId = req.user!.id;

    /**
     * Fetch conversations from service
     */
    const conversations = await ChatService.getUserConversations(userId);

    /**
     * Send response
     */
    sendResponse(res, 200, "Conversations fetched successfully", conversations);
  }),

  /**
   * -------------------------------------------------------
   * Get Messages
   * -------------------------------------------------------
   * Returns all messages for a specific conversation.
   *
   * Endpoint:
   * GET /api/chat/:conversationId/messages
   *
   * Example:
   * GET /api/chat/5/messages
   *
   * Authentication required.
   */
  getMessages: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Extract conversation ID from URL params
     */
    const conversationId = Number(req.params.conversationId);

    /**
     * Fetch messages from service
     */
    const messages = await ChatService.getMessages(conversationId);

    /**
     * Send standardized response
     */
    sendResponse(res, 200, "Messages fetched successfully", messages);
  }),

  /**
   * -------------------------------------------------------
   * Send Message
   * -------------------------------------------------------
   * Sends a message to a conversation.
   *
   * Supports:
   * - text messages
   * - image messages
   * - video messages
   *
   * Endpoint:
   * POST /api/chat/:conversationId/message
   *
   * Example request body:
   *
   * {
   *   "text": "Hello",
   *   "mediaUrl": "/uploads/chat/photo.jpg",
   *   "mediaType": "IMAGE"
   * }
   *
   * Authentication required.
   */
  sendMessage: asyncHandler(async (req: Request, res: Response) => {
    /**
     * Sender is the authenticated user
     */
    const senderId = req.user!.id;

    /**
     * Conversation ID from URL
     */
    const conversationId = Number(req.params.conversationId);

    /**
     * Extract message payload
     */
    const { text, mediaUrl, mediaType } = req.body;

    /**
     * Call service to store message in database
     */
    const message = await ChatService.sendMessage(
      senderId,
      conversationId,
      text,
      mediaUrl,
      mediaType,
    );

    /**
     * Return success response
     */
    sendResponse(res, 201, "Message sent successfully", message);
  }),
};
