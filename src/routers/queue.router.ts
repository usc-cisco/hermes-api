import { queueNumberService } from "../db/services/queue-number.service"
import { validateQueueToken } from "../middleware/authMiddleware"
import { jwtPlugin } from "../plugin/JwtPlugin"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { CourseNameEnum } from "../types/enums/CourseNameEnum"
import { basicAuth } from "@eelkevdbos/elysia-basic-auth"
import Elysia, { t } from "elysia"

type QueueContext = {
  headers: {
    idNumber?: string
    course?: string
  }
  params: {
    course: CourseNameEnum
  }
}

export const queue = new Elysia({ prefix: "/queue" })
  .use(
    basicAuth({
      credentials: { env: "ADMIN_CREDENTIALS" },
      scope: "/queue/admin",
    }),
  )
  .use(jwtPlugin)
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
  })
  .guard({
    params: "course",
  })
  .delete("/admin/reset", () => queueNumberService.resetAll())
  .delete(
    "/number",
    async ({ headers }: QueueContext) => {
      const studentId = headers.idNumber

      if (!studentId) {
        return { message: "Student ID not found" }
      }

      return await queueNumberService.dequeueById(studentId)
    },
    {
      beforeHandle: [validateQueueToken],
    },
  )
  .get("/:course/number/current", async ({ params: { course } }: QueueContext) => {
    return await queueNumberService.findCurrentQueueByCourse(course)
  })
  .post(
    "/:course/number",
    async ({ headers, params: { course } }: QueueContext) => {
      const studentId = headers.idNumber

      if (!studentId) {
        return { message: "Student ID not found" }
      }

      // Check if student already has a queue number
      if (await queueNumberService.findByStudentId(studentId)) return { message: "Student already has a queue number" }

      return await queueNumberService.enqueue(course, studentId)
    },
    {
      beforeHandle: [validateQueueToken],
    },
  )
  .patch("/admin/:course/number/current", async ({ params: { course } }: QueueContext) => {
    return await queueNumberService.dequeueFront(course)
  })
  .delete("/admin/:course/reset", ({ params: { course } }: QueueContext) => {
    return queueNumberService.resetByCourse(course)
  })
