import { queueNumberService } from "../db/services/queue-number.service"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { basicAuth } from "@eelkevdbos/elysia-basic-auth"
import Elysia, { t } from "elysia"

export const queue = new Elysia({ prefix: "/queue" })
  .use(
    basicAuth({
      credentials: { env: "ADMIN_CREDENTIALS" },
      scope: "/admin",
    }),
  )
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
  })
  .guard({
    params: "course",
  })
  .post("/:course/number", async ({ params: { course } }) => {
    return await queueNumberService.enqueue(course)
  })
  .get("/:course/number/current", async ({ params: { course } }) => {
    return await queueNumberService.findCurrentQueueByCourse(course)
  })
  .patch("/admin/:course/number/current", async ({ params: { course } }) => {
    return await queueNumberService.dequeue(course)
  })
  .delete("/admin/:course/reset", ({ params: { course } }) => {
    return queueNumberService.resetByCourse(course)
  })
  .delete("/admin/reset", () => queueNumberService.resetAll())
