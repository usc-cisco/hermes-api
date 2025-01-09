import { integer, sqliteTable } from "drizzle-orm/sqlite-core"

export const queueNumbers = sqliteTable("queue_numbers", {
  id: integer("id").primaryKey(),
  student_id: integer("student_id").unique().notNull(),
  course_id: integer("course_id").notNull(),
  queue_number: integer("queue_number").notNull(),
})
