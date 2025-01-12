import { coordinatorService } from "../db/services/coordinator.service"
import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { StatusUnion } from "../types/entities/dtos/StatusUnion"
import { CoordinatorStatusEnum } from "../types/enums/CoordinatorStatusEnum"
import { CourseNameEnum } from "../types/enums/CourseNameEnum"
import Elysia, { t } from "elysia"

type CoordinatorContext = {
  params: {
    course: CourseNameEnum
  }
  body: {
    status: CoordinatorStatusEnum
  }
}

export const coordinator = new Elysia({ prefix: "/coordinator" })
  .model({
    course: t.Object({
      course: CourseUnion,
    }),
    newStatus: t.Object({
      status: StatusUnion,
    }),
  })
  .guard({
    params: "course",
  })
  .get(
    "/:course",
    async ({ params: { course } }: CoordinatorContext) => {
      return await coordinatorService.findCoordinatorByCourse(course)
    },
    {
      tags: ["Coordinator"],
      detail: {
        description: "Gets the coordinator info & status of a specified course.",
        responses: {
          "200": {
            description: "Successfully fetched the student's queue number.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "The teacher's id. Not important.",
                    },
                    name: {
                      type: "string",
                      description: "The name of the coordinator.",
                    },
                    courseName: {
                      type: "string",
                      description: "CourseNameEnum (ie. BSCS | BSIT | BSIS)",
                    },
                    queueNumber: {
                      type: "string",
                      description: "CoordinatorStatusEnum (ie. available | away | unavailable)",
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
  .patch(
    "/admin/:course/status",
    async ({ body, params: { course } }: CoordinatorContext) => {
      return await coordinatorService.updateCoordinatorStatus(course, body.status)
    },
    {
      body: "newStatus",
      tags: ["Coordinator"],
      detail: {
        description: "Updates the coordinator status of a specified course.",
        responses: {
          "200": {
            description: "Successfully updated the coordinator's status.",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    id: {
                      type: "number",
                      description: "The teacher's id. Not important.",
                    },
                    name: {
                      type: "string",
                      description: "The name of the coordinator.",
                    },
                    courseName: {
                      type: "string",
                      description: "CourseNameEnum (ie. BSCS | BSIT | BSIS)",
                    },
                    queueNumber: {
                      type: "string",
                      description: "CoordinatorStatusEnum (ie. available | away | unavailable)",
                    },
                  },
                },
              },
            },
          },
          "403": {
            description: "You did not set the correct Basic Auth header.",
          },
        },
      },
    },
  )
