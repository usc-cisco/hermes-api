import { env } from "./config/env.config"
import { Logger } from "./utils/logger.util"
import { swagger } from "@elysiajs/swagger"
import { Elysia } from "elysia"

class Note {
  constructor(public data: string[] = ["Moonhalo"]) {}
}

const app = new Elysia()
  .use(swagger())
  .onError(({ error, code }) => {
    Logger.error("The server encountered an error", error)

    switch (code) {
      case "NOT_FOUND":
        return "Not found"
      default:
        return "An unexpected error occured"
    }
  })
  .decorate("note", new Note())
  .get("/error", () => {
    throw new Error("An error")
  })
  .get("/note", ({ note }) => note.data)
  .listen(env.PORT)

console.log(`🦊 Elysia is running at http://${app.server?.hostname}:${app.server?.port}`)
