import { courses } from "./courses.model"
import { InferSelectModel } from "drizzle-orm"
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const coordinators = sqliteTable("coordinators", {
  id: integer("id").primaryKey(),
  name: text("name").unique().notNull(),
  courseName: text("course_name")
    .notNull()
    .references(() => courses.courseName),
  status: text("status").notNull(),
  email: text("email").notNull(),
})

export type SelectCoordinator = InferSelectModel<typeof coordinators>
