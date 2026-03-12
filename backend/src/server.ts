import app from "./app";
import { initSocket } from "./realtime/socket";
import { logger } from "./shared/utils/logger";
import http from "http";

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

/**
 * Initialize socket server
 */
initSocket(server);


server.listen(PORT, () => {
  logger.info(` Server running on http://localhost:${PORT}`);
  logger.info(` Swagger docs available at http://localhost:${PORT}/api-docs`);
});
