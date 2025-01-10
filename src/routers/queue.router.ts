import { queueNumberService } from "../db/services/queue-number.service"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import Elysia, { t } from "elysia"

export const queue = new Elysia({ prefix: "/queue" })
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
  .patch("/:course/number/current", async ({ params: { course } }) => {
    return await queueNumberService.dequeue(course)
  })
  .delete("/:course/reset", ({ params: { course } }) => {
    return queueNumberService.resetByCourse(course)
  })
  .delete("/reset", () => queueNumberService.resetAll())
