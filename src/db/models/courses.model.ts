import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey(),
  courseName: text("course_name").unique().notNull(),
  coordinatorAvailability: integer("coordinator_availability", { mode: "boolean" }).notNull(),
})
