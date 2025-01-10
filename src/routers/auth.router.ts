import { jwtPlugin } from "../plugin/JwtPlugin"
import { GetAuthQueueToken } from "../services/auth.service"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { HttpStatusEnum } from "../types/enums/HttpStatusEnum"
import Elysia, { t } from "elysia"

export const auth = new Elysia({ prefix: "/auth" })
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
  })
  .use(jwtPlugin)
  .post(
    "/signIn",
    async ({ set, queueJwt, body: { course } }) => {
      set.status = HttpStatusEnum.CREATED
      return GetAuthQueueToken(queueJwt, course)
    },
    {
      async beforeHandle(context): Promise<void | { message: string }> {
        if (context.headers.authorization) {
          const token = context.headers.authorization.split(" ")[1]
          const validToken = await context.queueJwt.verify(token)

          console.log(token)

          if (validToken) {
            context.set.status = HttpStatusEnum.BAD_REQUEST
            return { message: "You are in a Queue Already!" }
          }
        }
      },
      body: "course",
    },
  )
