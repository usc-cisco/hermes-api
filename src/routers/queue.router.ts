import { queueNumberService } from "../db/services/queue-number.service"
import { QueueTokenValidation } from "../middleware/authMiddleware"
import { jwtPlugin } from "../plugin/JwtPlugin"
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
  .use(jwtPlugin)
  /** Test Middleware Implementation **/
  .get("/:course/number/current", ({ params: { course } }) => {
    return `Now serving #?? for ${course}`
  })
  .post(
    "/:course/number",
    async ({ params: { course }, headers }) => {
      if (headers.course !== course) {
        return `You are not authorized to queue for ${course}`
      } // create a middleware for this

      return await queueNumberService.enqueue(course)
    },
    {
      beforeHandle: QueueTokenValidation,
    },
  )
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
