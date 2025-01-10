import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { jwt } from "@elysiajs/jwt"
import { Elysia, t } from "elysia"

export const jwtPlugin = new Elysia()
  .use(
    jwt({
      name: "queueJwt",
      schema: t.Object({
        course: CourseUnion,
        queueNumber: t.Number(),
      }),
      secret: "TEST TEST SECRET",
      exp: "1h", // Will change to EOD.time - current.time
    }),
  )
  .derive({ as: "global" }, ({ queueJwt }) => {
    return { queueJwt: queueJwt }
  })
