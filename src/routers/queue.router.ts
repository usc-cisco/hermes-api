import { queueNumberService } from "../db/services/queue-number.service"
import { validateQueueToken } from "../middleware/authMiddleware"
import { jwtPlugin } from "../plugin/JwtPlugin"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { CourseNameEnum } from "../types/enums/CourseNameEnum"
import { Logger } from "../utils/logger.util"
import { basicAuth } from "@eelkevdbos/elysia-basic-auth"
import Elysia, { error, t } from "elysia"

type QueueContext = {
  headers: {
    idNumber?: string
    course?: string
  }
  params: {
    course: CourseNameEnum
  }
}

export const queue = new Elysia({ prefix: "/queue" })
  .use(
    basicAuth({
      credentials: { env: "ADMIN_CREDENTIALS" },
      scope: "/queue/admin",
    }),
  )
  .use(jwtPlugin)
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
  })
  .delete("/admin/reset", () => queueNumberService.resetAll(), {
    tags: ["Queue"],
    detail: {
      description: "Deletes all the queue numbers for every course.",
    },
  })
  .delete(
    "/number",
    async ({ headers }: QueueContext) => {
      const studentId = headers.idNumber

      if (!studentId) {
        return error(400, "Student ID not found")
      }

      return await queueNumberService.dequeueById(studentId)
    },
    {
      beforeHandle: [validateQueueToken],
      tags: ["Queue"],
      detail: {
        description: "Deletes a student's own queue number.",
        responses: {
          "200": {
            description: "Successfully deleted the student's queue number.",
          },
          "401": {
            description: "Unauthorized.",
          },
        },
      },
    },
  )
  .get(
    "/number",
    async ({ headers }: QueueContext) => {
      const studentId = headers.idNumber
      Logger.warn("Student id is " + studentId)

      if (!studentId) {
        return error(400, "Student ID not found")
      }

      const queueNumber = await queueNumberService.findByStudentId(studentId)

      if (!queueNumber) {
        return error(404, "No queue number found")
      }

      return queueNumber
    },
    {
      beforeHandle: [validateQueueToken],
      tags: ["Queue"],
      detail: {
        description: "Gets the queue number of a student.",
        responses: {
          "404": {
            description: "The student does not currently have a queue number.",
          },
          "200": {
            description: "Successfully fetched the student's queue number.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "The queue number SQL id. Not important.",
                    },
                    studentId: {
                      type: "string",
                      description: "The studentId associated with the queue number.",
                    },
                    courseName: {
                      type: "string",
                      description: "The queue number's course (ie. BSCS, BSIT, BSIS).",
                    },
                    queueNumber: {
                      type: "number",
                      description: "The queue number.",
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
  .get(
    "/:course/number/current",
    async ({ params: { course } }: QueueContext) => {
      return await queueNumberService.findCurrentQueueByCourse(course)
    },
    {
      params: "course",
      tags: ["Queue"],
      detail: {
        description: "Gets the queue status of a course.",
        responses: {
          "200": {
            description: "Successfully fetched the queue status.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    current: {
                      type: "number",
                      description: "The queue number currently being attended to.",
                    },
                    max: {
                      type: "number",
                      description: "The largest queue number.",
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
    "/:course/number",
    async ({ headers, params: { course } }: QueueContext) => {
      const studentId = headers.idNumber

      if (!studentId) {
        return error(404, "Student ID not found")
      }

      // Check if student already has a queue number
      if (await queueNumberService.findByStudentId(studentId)) return error(400, "Student already has a queue number")

      return await queueNumberService.enqueue(course, studentId)
    },
    {
      params: "course",
      beforeHandle: [validateQueueToken],
      tags: ["Queue"],
      detail: {
        description: "Creates a queue number and associates the JWT student ID with it.",
        requestBody: {
          required: false,
          description: "No request body required. (!) Make sure to select None as the body type.",
          content: {},
        },
        responses: {
          "200": {
            description: "Successfully created a queue number for the student.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "The queue number SQL id. Not important.",
                    },
                    studentId: {
                      type: "string",
                      description: "The studentId associated with the queue number.",
                    },
                    courseName: {
                      type: "string",
                      description: "The queue number's course (ie. BSCS, BSIT, BSIS).",
                    },
                    queueNumber: {
                      type: "number",
                      description: "The queue number.",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Student already has a queue number.",
          },
        },
      },
    },
  )
  .patch(
    "/admin/:course/number/current",
    async ({ params: { course } }: QueueContext) => {
      return await queueNumberService.dequeueFront(course)
    },
    {
      params: "course",
      tags: ["Queue"],
      detail: {
        description: "Moves the queue forward by dequeuing the currently being served number.",
        security: [
          {
            basicAuth: [],
          },
        ],
      },
    },
  )
  .delete(
    "/admin/:course/reset",
    ({ params: { course } }: QueueContext) => {
      return queueNumberService.resetByCourse(course)
    },
    {
      params: "course",
      tags: ["Queue"],
      detail: {
        description: "Resets the queue of a course.",
        security: [
          {
            basicAuth: [],
          },
        ],
      },
    },
  )
