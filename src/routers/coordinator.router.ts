import { CourseUnion } from "../models/CourseUnion"
import { StatusUnion } from "../models/StatusUnion"
import Elysia, { t } from "elysia"

export const queue = new Elysia({ prefix: "/coordinator" })
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
  .get("/:course", ({ params: { course } }) => {
    return `The coordinator of ${course} is X and their status is Y`
  })
  .patch(
    "/:course/coordinator/status",
    ({ params: { course } }) => {
      return `Successfully updated the status of the coordinator for ${course}`
    },
    {
      body: "newStatus",
    },
  )
