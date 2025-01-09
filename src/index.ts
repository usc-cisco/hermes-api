import { env } from "./config/env.config"
import { coordinator } from "./routers/coordinator.router"
import { queue } from "./routers/queue.router"
import { Logger } from "./utils/logger.util"
import { swagger } from "@elysiajs/swagger"
import { Elysia, t } from "elysia"

const app = new Elysia()
  .use(swagger())
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
