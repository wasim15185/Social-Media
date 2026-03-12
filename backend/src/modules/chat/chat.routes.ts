import express from "express";
import { ChatController } from "./chat.controller";
import { authMiddleware } from "../../shared/middlewares/auth.middleware";
import { validateRequest } from "../../shared/middlewares/validateRequest";
import { sendMessageSchema } from "./chat.dto";

const router = express.Router();

/**
 * ------------------------------------------------
 * Chat Routes
 * ------------------------------------------------
 * Handles:
 * - conversations
 * - messages
 * - sending media/text messages
 */

/**
 * @swagger
 * tags:
 *   name: Chat
 *   description: Chat and messaging APIs
 */

/**
 * @swagger
 * /chat/conversation:
 *   post:
 *     summary: Create conversation with another user
 *     description: Creates a conversation between two users if it doesn't already exist.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               targetUserId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       201:
 *         description: Conversation created successfully
 */
router.post("/conversation", authMiddleware, ChatController.createConversation);

/**
 * @swagger
 * /chat/conversations:
 *   get:
 *     summary: Get conversations of current user
 *     description: Returns all conversations where the authenticated user is a participant.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations fetched successfully
 */
router.get("/conversations", authMiddleware, ChatController.getConversations);

/**
 * @swagger
 * /chat/{conversationId}/messages:
 *   get:
 *     summary: Get messages of a conversation
 *     description: Returns all messages belonging to a specific conversation.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 */
router.get(
  "/:conversationId/messages",
  authMiddleware,
  ChatController.getMessages,
);

/**
 * @swagger
 * /chat/{conversationId}/message:
 *   post:
 *     summary: Send message in conversation
 *     description: Sends a text, image, or video message.
 *     tags: [Chat]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: conversationId
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *                 example: Hello
 *               mediaUrl:
 *                 type: string
 *                 example: /uploads/chat/photo.jpg
 *               mediaType:
 *                 type: string
 *                 enum: [IMAGE, VIDEO]
 *     responses:
 *       201:
 *         description: Message sent successfully
 */
router.post(
  "/:conversationId/message",
  authMiddleware,
  validateRequest(sendMessageSchema),
  ChatController.sendMessage,
);

export default router;
