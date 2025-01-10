import { CourseNameEnum } from "../enums/CourseNameEnum"
import { JWTPayloadSpec } from "@elysiajs/jwt"
import { StatusMap } from "elysia"
import { ElysiaCookie } from "elysia/dist/cookies"
import { HTTPHeaders } from "elysia/dist/types"

export interface QueueJwtPayload extends JWTPayloadSpec {
  queueNumber: number
  course: CourseNameEnum
}

export interface JWTInterface {
  queueJwt: {
    sign: (
      payload: {
        queueNumber: number
        course: CourseNameEnum
      } & JWTPayloadSpec,
    ) => Promise<string>
    verify: (payload: string) => Promise<JWTPayloadSpec | false>
  }
}

export interface JWTMiddlewareContext extends JWTInterface {
  set: {
    headers: HTTPHeaders
    status?: number | keyof StatusMap
    redirect?: string
    cookie?: Record<string, ElysiaCookie>
  }
  headers: Record<string, string | undefined>
}
