import { JWTModel } from "../types/entities/dtos/JwtModel"
import { jwt } from "@elysiajs/jwt"
import { Elysia } from "elysia"

// Expires on EOD time - curr time
const JWTExpiry = Number(process.env.QUEUE_EXPIRY) - new Date().getHours()

export const jwtPlugin = new Elysia()
  .use(
    jwt({
      name: "queueJwt",
      schema: JWTModel,
      secret: process.env.JWT_SECRET || "TEST SECRET KEY",
      // exp: JWTExpiry + "h", // It expires 5pm+
      exp: "1h", // testing
    }),
  )
  .derive({ as: "global" }, ({ queueJwt }) => {
    return { queueJwt: queueJwt }
  })
