import { studentService } from "../db/services/student.service"
import { jwtPlugin } from "../plugin/JwtPlugin"
import { getAuthToken } from "../services/auth.service"
import { JwtModel } from "../types/entities/dtos/JwtModel"
import { HttpStatusEnum } from "../types/enums/HttpStatusEnum"
import Elysia from "elysia"

export const auth = new Elysia({ prefix: "/auth" })
  .model({
    JwtModel,
  })
  .use(jwtPlugin)
  .post(
    "/sign-in",
    async ({ set, queueJwt, body }) => {
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
      const token = await getAuthToken(queueJwt, body)
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
