import { db } from ".."
import { courses } from "../models/courses.model"
import { eq } from "drizzle-orm"

export const queueNumberService = {
  async findById() {
    const result = await db.select().from(courses).where(eq(courses.id, 1))

    console.log(result)
  },
}
