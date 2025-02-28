import { InferSelectModel } from "drizzle-orm"
import { sqliteTable, text } from "drizzle-orm/sqlite-core"

export const students = sqliteTable("students", {
  id: text("student_id").notNull().primaryKey(),
  name: text("name").notNull(),
})

export type SelectStudent = InferSelectModel<typeof students>
