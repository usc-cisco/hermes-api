import { coordinatorService } from "../db/services/coordinator.service"
import { CourseValidation, QueueTokenValidation } from "../middleware/authMiddleware"
import { jwtPlugin } from "../plugin/JwtPlugin"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { StatusUnion } from "../types/entities/dtos/StatusUnion"
import { CoordinatorStatusEnum } from "../types/enums/CoordinatorStatusEnum"
import { CourseNameEnum } from "../types/enums/CourseNameEnum"
import { basicAuth } from "@eelkevdbos/elysia-basic-auth"
import Elysia, { t } from "elysia"

type CoordinatorContext = {
  params: {
    course: CourseNameEnum
  }
  body: {
    status: CoordinatorStatusEnum
  }
}

export const coordinator = new Elysia({ prefix: "/coordinator" })
  .use(
    basicAuth({
      credentials: { env: "ADMIN_CREDENTIALS" },
      scope: "/coordinator/admin",
    }),
  )
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
    newStatus: t.Object({
      status: StatusUnion,
    }),
  })
  .use(jwtPlugin)
  .guard({
    params: "course",
  })
  .get(
    "/:course",
    async ({ params: { course } }: CoordinatorContext) => {
      return await coordinatorService.findCoordinatorByCourse(course)
    },
    {
      beforeHandle: [QueueTokenValidation, CourseValidation],
    },
  )
  .patch(
    "/admin/:course/coordinator/status",
    async ({ body, params: { course } }: CoordinatorContext) => {
      return await coordinatorService.updateCoordinatorStatus(course, body.status)
    },
    {
      body: "newStatus",
    },
  )
