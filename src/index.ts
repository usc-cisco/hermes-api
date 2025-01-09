import { env } from "./config/env.config"
import { coordinatorService } from "./db/services/coordinator.service"
import { coordinator } from "./routers/coordinator.router"
import { queue } from "./routers/queue.router"
import { CoordinatorStatusEnum } from "./types/enums/CoordinatorStatusEnum"
import { CourseNameEnum } from "./types/enums/CourseNameEnum"
import { Logger } from "./utils/logger.util"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"

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
