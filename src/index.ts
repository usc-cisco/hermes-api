import { env } from "./config/env.config"
import { basicAuth } from "./middleware/basicAuthMiddleware"
import { auth } from "./routers/auth.router"
import { coordinator } from "./routers/coordinator.router"
import { queue } from "./routers/queue.router"
import { Logger } from "./utils/logger.util"
import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { Elysia, error as elysiaError } from "elysia"
import { student } from "./routers/student.router"
import { announcement } from "./routers/announcement.router"

const app = new Elysia()
  .use(
    basicAuth({
      credentials: { env: "ADMIN_CREDENTIALS" },
      scope: ["/auth/admin", "/queue/admin", "/coordinator/admin", "/student/admin", "/announcement/admin"],
      skipCorsPreflight: true,
    }),
  )
  // .use(rateLimit({ max: 30, duration: 2000, errorResponse: "Rate limit reached" }))
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
          { name: "Student", description: "Methods related to student management" },
          { name: "Announcement", description: "Methods related to announcements" },
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
  .use(
    cors({
      origin: [/.*\.dcism\.org$/, /https?:\/\/localhost(:\d+)?$/],
      methods: ["GET", "PATCH", "DELETE", "POST", "PUT"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    }),
  )
  .use(Logger.fileMiddleware())
  .use(Logger.streamMiddleware())
  .onError(({ error, code }) => {
    Logger.error("The server encountered an error", error)

    if (code === "NOT_FOUND") {
      return elysiaError(404, "Not found")
    } else if (code === "VALIDATION") {
      return elysiaError(400, error.validator.Errors(error.value).First().message)
    } else if (code === "BASIC_AUTH_ERROR") {
      return elysiaError(403, "Unauthorized")
    } else {
      return elysiaError(500, "An unexpected error occurred")
    }
  })
  .use(queue)
  .use(coordinator)
  .use(auth)
  .use(student)
  .use(announcement)
  .listen(env.PORT)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
