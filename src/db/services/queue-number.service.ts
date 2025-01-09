import { db } from ".."
import { IQueueNumberService } from "../../types/abstracts/queue-number-service.abstract"
import type { QueueNumber } from "../../types/entities/queue-number"
import { CourseIdEnum } from "../../types/enums/CourseIdEnum"
import { courses } from "../models/courses.model"
import { queueNumbers } from "../models/queue-number.model"
import { eq } from "drizzle-orm"

export const queueNumberService: IQueueNumberService = {
  async findByCourse(course_id: CourseIdEnum): Promise<QueueNumber[]> {
    const records = await db.select().from(queueNumbers).where(eq(courses.id, course_id))

    return records
  },

  async enqueue(student_id: number, course_id: CourseIdEnum): Promise<QueueNumber> {
    const count = await db.$count(queueNumbers, eq(courses.id, course_id))

    const records = await db
      .insert(queueNumbers)
      .values({ student_id, course_id, queue_number: count + 1 })
      .returning()
    const record = records[0]

    return record
  },

  async dequeue(id: number): Promise<void> {
    await db.delete(queueNumbers).where(eq(queueNumbers.id, id))
  },

  async reset(): Promise<void> {
    await db.delete(queueNumbers)
  },
}
