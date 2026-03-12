import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

/**
 * Swagger Configuration
 * ---------------------------------------------------------
 * This file configures Swagger (OpenAPI) documentation
 * for the Express API.
 *
 * Swagger automatically reads JSDoc comments written
 * in route files and generates an interactive API
 * documentation page.
 */

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Social Media API",
      version: "1.0.0",
      description:
        "REST API documentation for Social Media Platform built using Express, TypeScript and Prisma",
    },

    servers: [
      {
        url: "http://localhost:5000/api",
        description: "Local Development Server",
      },
    ],

    /**
     * Components section defines reusable objects
     * like authentication schemes and request schemas
     */
    components: {
      /**
       * JWT Authentication Scheme
       * Allows Swagger UI to send Authorization header
       */
      securitySchemes: {
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      /**
       * Reusable Request Schemas
       */
      schemas: {
        RegisterUser: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: {
              type: "string",
              example: "wasim",
            },
            email: {
              type: "string",
              example: "wasim@email.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
        },

        LoginUser: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              example: "wasim@email.com",
            },
            password: {
              type: "string",
              example: "123456",
            },
          },
        },
      },
    },
  },

  /**
   * Swagger scans these files for @swagger comments
   */
  apis: ["./src/modules/**/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * Initialize Swagger middleware
 */
export const setupSwagger = (app: Express) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
