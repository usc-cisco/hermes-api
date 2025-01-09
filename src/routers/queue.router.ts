import Elysia, { t } from "elysia"

export const queue = new Elysia({ prefix: "/queue" })
  .model({
    courses: t.Object({
      course: t.Union([t.Literal("cs"), t.Literal("it"), t.Literal("is")]),
    }),
  })
  .post(
    "/:course/number",
    ({ params: { course } }) => {
      return `You are #?? for ${course}`
    },
    {
      params: "courses", // the object key of our shared model to type the { params }
    },
  )
  .get(
    "/:course/number/current",
    ({ params: { course } }) => {
      return `Now serving #?? for ${course}`
    },
    {
      params: "courses",
    },
  )
  .patch(
    "/:course/number/current",
    ({ params: { course } }) => {
      return `Advanced the queue number for ${course}`
    },
    {
      params: "courses",
    },
  )
  .post(
    "/:course/reset",
    ({ params: { course } }) => {
      return `Cleared the queue for ${course}`
    },
    {
      params: "courses",
    },
  )
