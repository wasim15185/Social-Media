import pino from "pino";

/**
 * Logger Utility
 * -----------------------------------------
 * Uses Pino for fast structured logging.
 *
 * In development:
 *  - Pretty logs with colors
 *
 * In production:
 *  - JSON logs for log aggregation
 */

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino(
  isProduction
    ? {} // Production → raw JSON logs
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard",
            ignore: "pid,hostname",
          },
        },
      },
);
