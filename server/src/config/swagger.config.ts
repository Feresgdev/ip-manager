import swaggerJsdoc from "swagger-jsdoc";
import type { OpenAPIV3 } from "openapi-types";
import path from "path";

const isProduction = process.env.NODE_ENV === "production";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "My API",
      version: "1.0.0",
      description: `
        API documentation for My Application.

        Built with Express 5 and TypeScript.
      `,
      contact: {
        name: "API Support",
        email: "support@example.com",
      },
    },

    servers: [
      {
        url: process.env.API_BASE_URL ?? "http://localhost:3000",
        description: isProduction ? "Production server" : "Development server",
      },
    ],

    components: {
      /* securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your Firebase ID token.",
        },
      }, */

      schemas: {
        ApiError: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false,
            },
            error: {
              type: "object",
              properties: {
                name: { type: "string", example: "NotFoundError" },
                message: { type: "string", example: "User not found" },
                code: { type: "string", example: "NOT_FOUND" },
                statusCode: { type: "integer", example: 404 },
                timestamp: {
                  type: "string",
                  format: "date-time",
                },
                requestId: { type: "string", format: "uuid" },
                path: { type: "string", example: "/api/users/123" },
                route: { type: "string", example: "/api/users/:id" },
                method: { type: "string", example: "GET" },
                durationMs: { type: "number", example: 12 },
              },
            },
          },
        },
      },
    },
  },

  apis: [path.resolve(process.cwd(), "server/src/modules/**/*.ts")],
};

export const swaggerSpec = swaggerJsdoc(options) as OpenAPIV3.Document;
