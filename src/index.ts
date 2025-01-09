import { env } from "./config/env.config"
import { coordinator } from "./routers/coordinator.router"
import { queue } from "./routers/queue.router"
import { Logger } from "./utils/logger.util"
import { cors } from "@elysiajs/cors"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"
import { rateLimit } from "elysia-rate-limit"

const app = new Elysia()
  .use(rateLimit({ max: 5, duration: 2000, errorResponse: "Rate limit reached" }))
  .use(swagger())
  .use(cors())
  .use(Logger.middleware())
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
  .get("/health", () => "Server is healthy")
  .use(queue)
  .use(coordinator)
  .listen(env.PORT)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
