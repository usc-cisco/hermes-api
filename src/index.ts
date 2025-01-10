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
  .get("/health", () => "Server is healthy")
  .use(swagger())
  .use(cors())
  .use(Logger.fileMiddleware())
  .use(Logger.streamMiddleware())
  .onError(({ error, code }) => {
    Logger.error("The server encountered an error", error)

    if (code === "NOT_FOUND") {
      return "Not found"
    } else if (code === "VALIDATION") {
      return error.validator.Errors(error.value).First().message
    } else {
      return "An unexpected error occurred"
    }
  })
  .use(queue)
  .use(coordinator)
  .use(auth)
  .listen(env.PORT)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
