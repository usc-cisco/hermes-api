import { CourseUnion } from "../models/CourseUnion"
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
    return `Now serving #?? for ${course}`
  })
  .patch("/:course/number/current", ({ params: { course } }) => {
    return `Advanced the queue number for ${course}`
  })
  .post("/:course/reset", ({ params: { course } }) => {
    return `Cleared the queue for ${course}`
  })
