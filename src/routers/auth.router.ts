import { jwtPlugin } from "../plugin/JwtPlugin"
import { GetAuthQueueToken } from "../services/auth.service"
import { JWTModel } from "../types/entities/dtos/JwtModel"
import { HttpStatusEnum } from "../types/enums/HttpStatusEnum"
import Elysia from "elysia"

export const auth = new Elysia({ prefix: "/auth" })
  .model({
    JWTModel,
  })
  .use(jwtPlugin)
  .post(
    "/sign-in",
    async ({ set, queueJwt, body }) => {
      set.status = HttpStatusEnum.CREATED
      const token = await GetAuthQueueToken(queueJwt, body)
      return {
        token,
      }
    },
    {
      body: JWTModel,
    },
  )
