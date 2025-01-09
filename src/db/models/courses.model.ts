import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core"

export const courses = sqliteTable("courses", {
  id: integer("id").primaryKey(),
  courseName: text("name").unique().notNull(),
  coordinatorAvailability: integer({ mode: "boolean" }).notNull(),
})
