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
  .post(
    "/:course/number",
    ({ params: { course }, headers }) => {
      console.log(headers.course)

      if (headers.course !== course) {
        return `You are not authorized to queue for ${course}`
      } // create a middleware for this

      return `You are ${headers.queueNumber} for ${course}`
    },
    {
      beforeHandle: QueueTokenValidation,
    },
  )
  .get("/:course/number/current", ({ params: { course } }) => {
    return `Now serving #?? for ${course}`
  })
  .patch("/:course/number/current", ({ params: { course } }) => {
    return `Advanced the queue number for ${course}`
  })
  .post("/:course/reset", ({ params: { course } }) => {
    return `Cleared the queue for ${course}`
  })
