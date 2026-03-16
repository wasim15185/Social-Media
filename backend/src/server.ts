import app from "./app";
import { initSocket } from "./realtime/socket";
import { logger } from "./shared/utils/logger";
import http from "http";

const PORT = process.env.SERVER_PORT || 5000;

const server = http.createServer(app);

/**
 * Initialize socket server
 */
initSocket(server);


server.listen(PORT, () => {
  logger.info(` Server running on ${process.env.SERVER_BASE_URL}:${PORT}`);
  logger.info(
    ` Swagger docs available at ${process.env.SERVER_BASE_URL}:${PORT}/api-docs`,
  );
});
