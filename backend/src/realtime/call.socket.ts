import { Server, Socket } from "socket.io";
import { logger } from "../shared/utils/logger";

/**
 * Video Call Socket Handler
 * -----------------------------------------------------
 * This file handles signaling for WebRTC video calls.
 *
 * WebRTC requires a signaling server to exchange:
 *  - SDP offers
 *  - SDP answers
 *  - ICE candidates
 *
 * Socket.IO is used here for signaling.
 */

export const callSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    logger.info(`Socket connected for call system: ${socket.id}`);

    /**
     * User joins their personal room
     * so other users can send call events.
     *
     * Example:
     * socket.join("user_12")
     */
    socket.on("join-user-room", (userId: number) => {
      const room = `user_${userId}`;

      socket.join(room);

      logger.info(`User ${userId} joined call room`);
    });

    /**
     * Call a user
     *
     * Client sends:
     *  - target user id
     *  - WebRTC offer
     */
    socket.on("call-user", (data) => {
      const { targetUserId, offer, callerId } = data;

      const targetRoom = `user_${targetUserId}`;

      logger.info(`User ${callerId} calling ${targetUserId}`);

      io.to(targetRoom).emit("incoming-call", {
        callerId,
        offer,
      });
    });

    /**
     * Answer a call
     *
     * Client sends WebRTC answer.
     */
    socket.on("answer-call", (data) => {
      const { callerId, answer } = data;

      const callerRoom = `user_${callerId}`;

      logger.info(`Call answered by receiver`);

      io.to(callerRoom).emit("call-answered", {
        answer,
      });
    });

    /**
     * ICE candidate exchange
     *
     * WebRTC requires ICE candidates to establish
     * a direct peer-to-peer connection.
     */
    socket.on("ice-candidate", (data) => {
      const { targetUserId, candidate } = data;

      const targetRoom = `user_${targetUserId}`;

      io.to(targetRoom).emit("ice-candidate", {
        candidate,
      });
    });

    /**
     * End call
     */
    socket.on("end-call", (data) => {
      const { targetUserId } = data;

      const targetRoom = `user_${targetUserId}`;

      logger.info("Call ended");

      io.to(targetRoom).emit("call-ended");
    });

    /**
     * Handle disconnect
     */
    socket.on("disconnect", () => {
      logger.info(`Call socket disconnected: ${socket.id}`);
    });
  });
};
