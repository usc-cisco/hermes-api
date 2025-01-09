import { courses } from "./courses.model"
import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const queueNumbers = sqliteTable("queue_numbers", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  courseName: text("course_name")
    .notNull()
    .references(() => courses.courseName, {
      onDelete: "cascade",
    }),
  queueNumber: integer("queue_number").notNull(),
})

export type SelectQueueNumber = InferSelectModel<typeof queueNumbers>
export type InsertQueueNumber = InferInsertModel<typeof queueNumbers>
