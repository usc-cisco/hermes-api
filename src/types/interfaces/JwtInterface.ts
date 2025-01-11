import { CourseNameEnum } from "../enums/CourseNameEnum"
import { JWTPayloadSpec } from "@elysiajs/jwt"
import { StatusMap } from "elysia"

export interface QueueJwtPayload extends JWTPayloadSpec {
  idNumber: string
  course: CourseNameEnum
}

export interface JwtInterface {
  queueJwt: {
    sign: (payload: QueueJwtPayload & JWTPayloadSpec) => Promise<string>
    verify: (payload: string) => Promise<JWTPayloadSpec | false>
  }
}

export interface AuthMiddlewareContext extends JwtInterface {
  set: {
    status?: number | keyof StatusMap
  }
  headers: Record<string, string | undefined>
  params: Record<string, string | undefined>
  body: {
    idNumber: string
    course: CourseNameEnum
  }
}
