import { studentService } from "../db/services/student.service"
import { jwtPlugin } from "../plugin/JwtPlugin"
import { getAuthToken } from "../services/auth.service"
import { JwtModel } from "../types/entities/dtos/JwtModel"
import { HttpStatusEnum } from "../types/enums/HttpStatusEnum"
import { AuthMiddlewareContext, QueueJwtPayload } from "../types/interfaces/JwtInterface"
import Elysia from "elysia"

export const auth = new Elysia({ prefix: "/auth" })
  .model({
    JwtModel,
  })
  .use(jwtPlugin)
  .post(
    "/admin/sign-in",
    ({ set, headers }: AuthMiddlewareContext) => {
      const { authorization } = headers

      if (!authorization || !authorization.startsWith("Basic ")) {
        set.status = HttpStatusEnum.UNAUTHORIZED
        return { message: "Missing or invalid authorization header" }
      }

      const basicAuthToken = authorization.split(" ")[1]

      return {
        token: basicAuthToken,
      }
    },
    {
      detail: {
        tags: ["Auth"],
        description: "Use this to validate an admin sign in",
        responses: {
          "201": {
            description: "Admin successfully logged in",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message describing the issue.",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request. Missing or invalid parameters, or invalid credentials.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message describing the issue.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  )
  .post(
    "/sign-in",
    async ({ set, queueJwt, body }: AuthMiddlewareContext) => {
      if (!body.idNumber || !body.course) {
        set.status = HttpStatusEnum.BAD_REQUEST
        return { message: "ID number and course are required" }
      }

      const student = await studentService.findStudentById(body.idNumber)

      if (!student) {
        set.status = HttpStatusEnum.BAD_REQUEST
        return { message: "Student not found" }
      }

      set.status = HttpStatusEnum.CREATED

      const payload: QueueJwtPayload = body

      const token = await getAuthToken(queueJwt, payload)
      return {
        token,
      }
    },
    {
      body: JwtModel,
      detail: {
        tags: ["Auth"],
        description: "Use this to validate a student ID and create a JWT for validateQueueToken routes",
        responses: {
          "201": {
            description: "JWT successfully created.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    token: {
                      type: "string",
                      description: "The generated JWT token.",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request. Missing or invalid parameters, or student not found.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                      description: "Error message describing the issue.",
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  )
