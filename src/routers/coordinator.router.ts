import { coordinatorService } from "../db/services/coordinator.service"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { StatusUnion } from "../types/entities/dtos/StatusUnion"
import Elysia, { t } from "elysia"

export const coordinator = new Elysia({ prefix: "/coordinator" })
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
    newStatus: t.Object({
      status: StatusUnion,
    }),
  })
  .guard({
    params: "course",
  })
  .get("/:course", async ({ params: { course } }) => {
    return await coordinatorService.findCoordinatorByCourse(course)
  })
  .patch(
    "/:course/coordinator/status",
    async ({ params: { course } }) => {
      return await coordinatorService.findCoordinatorStatus(course)
    },
    {
      body: "newStatus",
    },
  )
