import { courses } from "./courses.model"
import { InferInsertModel, InferSelectModel } from "drizzle-orm"
import { integer, sqliteTable } from "drizzle-orm/sqlite-core"

export const queueNumbers = sqliteTable("queue_numbers", {
  id: integer("id").primaryKey(),
  studentId: integer("student_id").unique().notNull(),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id),
  queueNumber: integer("queue_number").notNull(),
})

export type SelectQueueNumber = InferSelectModel<typeof queueNumbers>
export type InsertQueueNumber = InferInsertModel<typeof queueNumbers>
