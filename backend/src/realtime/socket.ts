import { Server } from "socket.io";
import { logger } from "../shared/utils/logger";
import { chatSocket } from "./chat.socket";
import { callSocket } from "./call.socket";
import { notificationSocket } from "./notification.socket";

/**
 * Global Socket.IO instance
 */
let io: Server;

/**
 * Initialize Socket.IO Server
 * ------------------------------------------------
 * This function attaches Socket.IO to the HTTP server
 * and registers all socket modules.
 */
export const initSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  logger.info("Socket.IO initialized");

  /**
   * Base connection listener
   */
  io.on("connection", (socket) => {
    logger.info(`User connected: ${socket.id}`);

    socket.on("disconnect", () => {
      logger.info(`User disconnected: ${socket.id}`);
    });
  });

  /**
   * Register socket feature modules
   */
  chatSocket(io);
  callSocket(io);
  notificationSocket(io);
};

/**
 * Get Socket.IO instance
 * ------------------------------------------------
 * Allows emitting events from services/controllers
 */
export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
};
