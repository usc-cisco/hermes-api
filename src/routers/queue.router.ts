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
  .post("/:course/number", ({ params: { course } }) => {
    return `You are #?? for ${course}`
  })
  .get("/:course/number/current", ({ params: { course } }) => {
    // TODO: Remove this once we migrate away from Course IDs in the database schema.
    const COURSE_NAME_TO_COURSE_ID_DICT = {
      BSCS: 1,
      BSIT: 2,
      BSIS: 3,
    }

    return queueNumberService.findCurrentQueueByCourse(COURSE_NAME_TO_COURSE_ID_DICT[course])
  })
  .patch("/:course/number/current", ({ params: { course } }) => {
    return `Advanced the queue number for ${course}`
  })
  .post("/:course/reset", ({ params: { course } }) => {
    return `Cleared the queue for ${course}`
  })
