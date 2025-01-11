import { env } from "./config/env.config"
import { auth } from "./routers/auth.router"
import { coordinator } from "./routers/coordinator.router"
import { queue } from "./routers/queue.router"
import { Logger } from "./utils/logger.util"
import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"

const app = new Elysia()
  .use(rateLimit({ max: 30, duration: 2000, errorResponse: "Rate limit reached" }))
  .get("/health", () => "Server is healthy", { tags: ["Debug"], detail: { description: "Used for health checks." } })
  .use(
    swagger({
      documentation: {
        info: {
          title: "Hermes API Documentation",
          version: "0.0.1-beta",
        },
        tags: [
          { name: "Coordinator", description: "Methods related to viewing coordinator status & editing it" },
          { name: "Queue", description: "Methods related to interacting with the queue" },
          { name: "Auth", description: "Authentication endpoints" },
          { name: "Debug", description: "Routes for debugging" },
        ],
        components: {
          securitySchemes: {
            bearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
            },
            basicAuth: {
              type: "http",
              scheme: "basic",
            },
          },
        },
      },
    }),
  )
  .use(cors())
  .use(Logger.fileMiddleware())
  .use(Logger.streamMiddleware())
  .onError(({ error, code }) => {
    Logger.error("The server encountered an error", error)

    if (code === "NOT_FOUND") {
      return "Not found"
    } else if (code === "VALIDATION") {
      return error.validator.Errors(error.value).First().message
    } else if (code === "BASIC_AUTH_ERROR") {
      return "Unauthorized"
    } else {
      return "An unexpected error occurred"
    }
  })
  .use(queue)
  .use(coordinator)
  .use(auth)
  .listen(env.PORT)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
