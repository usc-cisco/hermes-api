import { InferSelectModel } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey(),
  courseName: text("course_name").unique().notNull(),
})

export type SelectCourse = InferSelectModel<typeof courses>
