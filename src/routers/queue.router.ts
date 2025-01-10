import { queueNumberService } from "../db/services/queue-number.service"
import { CourseValidation, QueueTokenValidation } from "../middleware/authMiddleware"
import { jwtPlugin } from "../plugin/JwtPlugin"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { CourseNameEnum } from "../types/enums/CourseNameEnum"
import { basicAuth } from "@eelkevdbos/elysia-basic-auth"
import Elysia, { t } from "elysia"

export const queue = new Elysia({ prefix: "/queue" })
  .use(
    basicAuth({
      credentials: { env: "ADMIN_CREDENTIALS" },
      scope: "/queue/admin",
    }),
  )
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
  })
  .use(jwtPlugin)
  .guard({
    params: "course",
  })
  .post(
    "/:course/number",
    async ({ params: { course } }: { params: { course: CourseNameEnum } }) => {
      return await queueNumberService.enqueue(course)
    },
    {
      beforeHandle: [QueueTokenValidation, CourseValidation],
    },
  )
  .get(
    "/:course/number/current",
    async ({ params: { course } }: { params: { course: CourseNameEnum } }) => {
      return await queueNumberService.findCurrentQueueByCourse(course)
    },
    {
      beforeHandle: [QueueTokenValidation, CourseValidation],
    },
  )
  .patch("/admin/:course/number/current", async ({ params: { course } }: { params: { course: CourseNameEnum } }) => {
    return await queueNumberService.dequeue(course)
  })
  .delete("/admin/:course/reset", ({ params: { course } }: { params: { course: CourseNameEnum } }) => {
    return queueNumberService.resetByCourse(course)
  })
  .delete("/admin/reset", () => queueNumberService.resetAll())
