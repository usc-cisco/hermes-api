import Elysia, { t } from "elysia"
import { announcementService } from "../db/services/announcement.service"

export const announcement = new Elysia({ prefix: "/announcement" })
  .model({
    addAnnouncement: t.Object({
      text: t.String({ description: "The announcement text" }),
    }),
  })
  .get(
    "/",
    async () => {
      return await announcementService.getAllAnnouncements()
    },
    {
      tags: ["Announcement"],
      detail: {
        description: "Gets all announcements, ordered by most recent first.",
        responses: {
          "200": {
            description: "Successfully retrieved all announcements.",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: {
                        type: "number",
                        description: "The announcement ID",
                      },
                      text: {
                        type: "string",
                        description: "The announcement text",
                      },
                      date: {
                        type: "string",
                        format: "date-time",
                        description: "When the announcement was created",
                      },
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
    "/admin",
    async ({ body }) => {
      if (!body.text || body.text.trim().length === 0) {
        return { error: "Announcement text is required" }
      }

      await announcementService.addAnnouncement(body.text)
      return { success: true }
    },
    {
      body: "addAnnouncement",
      tags: ["Announcement"],
      detail: {
        description: "Adds a new announcement with text (admin endpoint).",
        security: [
          {
            basicAuth: [],
          },
        ],
        requestBody: {
          required: true,
          description: "The announcement text.",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  text: {
                    type: "string",
                    description: "The announcement text",
                  },
                },
                required: ["text"],
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Successfully added the announcement.",
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
            description: "Bad request (e.g., text is empty or missing).",
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
  .delete(
    "/admin/:id",
    async ({ params }) => {
      const id = Number(params.id)

      if (isNaN(id) || id <= 0) {
        return { error: "Invalid announcement ID" }
      }

      // Check if announcement exists before deleting
      const allAnnouncements = await announcementService.getAllAnnouncements()
      const announcementExists = allAnnouncements.some((ann) => ann.id === id)

      if (!announcementExists) {
        return { error: "Announcement not found" }
      }

      await announcementService.deleteAnnouncement(id)
      return { success: true }
    },
    {
      tags: ["Announcement"],
      detail: {
        description: "Deletes an announcement by its ID (admin endpoint).",
        security: [
          {
            basicAuth: [],
          },
        ],
        responses: {
          "200": {
            description: "Successfully deleted the announcement.",
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
            description: "Bad request (e.g., invalid announcement ID).",
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
            description: "Announcement not found.",
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