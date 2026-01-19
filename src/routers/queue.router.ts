import { coordinatorService } from "../db/services/coordinator.service"
import { queueNumberService } from "../db/services/queue-number.service"
import { studentService } from "../db/services/student.service"
import { validateCourse, validateQueueToken } from "../middleware/authMiddleware"
import { jwtPlugin } from "../plugin/JwtPlugin"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { CoordinatorStatusEnum } from "../types/enums/CoordinatorStatusEnum"
import { CourseNameEnum } from "../types/enums/CourseNameEnum"
import { Logger } from "../utils/logger.util"
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
  .use(jwtPlugin)
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
    addStudentToQueue: t.Object({
      idNumber: t.String({ description: "The student's ID number" }),
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
      // @ts-expect-error TODO: Change this to an updated version of the basicAuth middleware once my patch is merged
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
      // @ts-expect-error TODO: Change this to an updated version of the basicAuth middleware once my patch is merged
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
        description: "Gets the queue status of a course & the student ID to be served.",
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
                    currentStudentId: {
                      type: "string",
                      nullable: true,
                      description:
                        "The student ID of the current queue number, otherwise null if no queue number exists.",
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
    "/admin/:course/number",
    async ({ body, params: { course } }) => {
      const studentId = body.idNumber

      if (!studentId) {
        return { error: "Student ID is required" }
      }

      // Check if student exists
      const student = await studentService.findStudentById(studentId)
      if (!student) {
        return { error: "Student not found" }
      }

      // Check if coordinator is still accepting new queue numbers
      const coordinatorStatus = (await coordinatorService.findCoordinatorByCourse(course)).status
      if (
        coordinatorStatus &&
        [CoordinatorStatusEnum.UNAVAILABLE, CoordinatorStatusEnum.CUTOFF].includes(
          coordinatorStatus as CoordinatorStatusEnum,
        )
      ) {
        return { error: "Coordinator is not accepting any new queue numbers" }
      }

      // Check if student already has a queue number
      const existingQueueNumber = await queueNumberService.findByStudentId(studentId)
      if (existingQueueNumber) {
        return { error: "Student already has a queue number" }
      }

      await queueNumberService.enqueue(course, studentId)
      return { success: true }
    },
    {
      params: "course",
      body: "addStudentToQueue",
      tags: ["Queue"],
      detail: {
        description: "Adds a student to the queue for a specific course (admin endpoint).",
        security: [
          {
            basicAuth: [],
          },
        ],
        requestBody: {
          required: true,
          description: "The student's ID number.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  idNumber: {
                    type: "string",
                    description: "The student's ID number",
                  },
                },
                required: ["idNumber"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully added the student to the queue.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    success: {
                      type: "boolean",
                      description: "Indicates if the operation was successful",
                    },
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad request (e.g., student already has a queue number, student ID missing).",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message",
                    },
                  },
                },
              },
            },
          },
          "404": {
            description: "Student not found.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: {
                      type: "string",
                      description: "Error message",
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
  // TODO: Uncomment when you wish to re-enable self-enqueueing for students
  // .post(
  //   "/:course/number",
  //   async ({ headers, params: { course } }: QueueContext) => {
  //     const studentId = headers.idNumber

  //     if (!studentId) {
  //       return error(404, "Student ID not found")
  //     }

  //     // Check if coordinator is still accepting new queue numbers
  //     const coordinatorStatus = (await coordinatorService.findCoordinatorByCourse(course)).status
  //     if (
  //       coordinatorStatus &&
  //       [CoordinatorStatusEnum.UNAVAILABLE, CoordinatorStatusEnum.CUTOFF].includes(
  //         coordinatorStatus as CoordinatorStatusEnum,
  //       )
  //     ) {
  //       return error(403, "Coordinator is not accepting any new queue numbers")
  //     }

  //     // Check if student already has a queue number
  //     if (await queueNumberService.findByStudentId(studentId)) {
  //       return error(400, "Student already has a queue number")
  //     }

  //     return await queueNumberService.enqueue(course, studentId)
  //   },
  //   {
  //     params: "course",
  //     // @ts-expect-error TODO: Change this to an updated version of the basicAuth middleware once my patch is merged
  //     beforeHandle: [validateQueueToken, validateCourse],
  //     tags: ["Queue"],
  //     detail: {
  //       description: "Creates a queue number and associates the JWT student ID with it.",
  //       requestBody: {
  //         required: false,
  //         description: "No request body required. (!) Make sure to select None as the body type.",
  //         content: {},
  //       },
  //       responses: {
  //         "200": {
  //           description: "Successfully created a queue number for the student.",
  //           content: {
  //             "application/json": {
  //               schema: {
  //                 type: "object",
  //                 properties: {
  //                   id: {
  //                     type: "number",
  //                     description: "The queue number SQL id. Not important.",
  //                   },
  //                   studentId: {
  //                     type: "string",
  //                     description: "The studentId associated with the queue number.",
  //                   },
  //                   courseName: {
  //                     type: "string",
  //                     description: "The queue number's course (ie. BSCS, BSIT, BSIS).",
  //                   },
  //                   queueNumber: {
  //                     type: "number",
  //                     description: "The queue number.",
  //                   },
  //                 },
  //               },
  //             },
  //           },
  //         },
  //         "400": {
  //           description: "Student already has a queue number.",
  //         },
  //         "401": {
  //           description: "Student's is incorrectly trying to join another course's queue.",
  //         },
  //         "403": {
  //           description:
  //             'The coordinator set their status to "unavailable" or "cutoff", meaning they are not accepting any new queue numbers.',
  //         },
  //       },
  //     },
  //   },
  // )
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
        requestBody: {
          required: false,
          description: "No request body required. (!) Make sure to select None as the body type.",
          content: {},
        },
        security: [
          {
            basicAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Successfully advanced the queue.",
          },
          "404": {
            description: "Course used in :course parameter was not found.",
          },
        },
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
        requestBody: {
          required: false,
          description: "No request body required. (!) Make sure to select None as the body type.",
          content: {},
        },
        responses: {
          "200": {
            description: "Successfully reset the course's queue.",
          },
        },
      },
    },
  )
