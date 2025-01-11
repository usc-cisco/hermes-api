import { env } from "../config/env.config"
import { JWTModel } from "../types/entities/dtos/JwtModel"
import { jwt } from "@elysiajs/jwt"
import { Elysia } from "elysia"

export const jwtPlugin = new Elysia()
  .use(
    jwt({
      name: "queueJwt",
      schema: JWTModel,
      secret: env.JWT_SECRET,
      // exp: `${env.JWT_EXPIRY}h`, // It expires 5pm+
      exp: "1h", // testing
    }),
  )
  .derive({ as: "global" }, ({ queueJwt }) => {
    return { queueJwt: queueJwt }
  })
