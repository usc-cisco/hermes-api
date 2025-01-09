import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey(),
  course_name: text("name"),
  coordinator_availability: integer({ mode: "boolean" }),
})
