import { db } from ".."
import { IQueueNumberService } from "../../types/abstracts/queue-number-service.abstract"
import type { QueueNumber } from "../../types/entities/queue-number"
import { CourseIdEnum } from "../../types/enums/CourseIdEnum"
import { queueNumbers } from "../models/queue-number.model"
import { asc, eq } from "drizzle-orm"

export const queueNumberService: IQueueNumberService = {
  async findByCourse(course_id: CourseIdEnum): Promise<QueueNumber[]> {
    const records = await db.select().from(queueNumbers).where(eq(queueNumbers.courseId, course_id))

    return records
  },

  async findCurrentQueueByCourse(course_id: CourseIdEnum): Promise<QueueNumber> {
    const record = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseId, course_id))
      .orderBy(asc(queueNumbers.queueNumber))
      .limit(1)

    return record[0]
  },

  async enqueue(student_id: number, course_id: CourseIdEnum): Promise<QueueNumber> {
    const count = await db.$count(queueNumbers, eq(queueNumbers.courseId, course_id))

    const data: Omit<QueueNumber, "id"> = {
      studentId: student_id,
      courseId: course_id,
      queueNumber: count + 1,
    }

    const records = await db.insert(queueNumbers).values(data).returning()
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
