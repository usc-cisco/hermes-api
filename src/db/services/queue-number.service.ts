import { db } from ".."
import { IQueueNumberService } from "../../types/abstracts/queue-number-service.abstract"
import type { QueueNumber } from "../../types/entities/queue-number"
import { CourseIdEnum } from "../../types/enums/CourseIdEnum"
import { InsertQueueNumber, SelectQueueNumber, queueNumbers } from "../models/queue-number.model"
import { asc, eq } from "drizzle-orm"

export const queueNumberService: IQueueNumberService = {
  async findByCourse(courseId: CourseIdEnum): Promise<QueueNumber[]> {
    const records = await db.select().from(queueNumbers).where(eq(queueNumbers.courseId, courseId))

    return records
  },

  async findCurrentQueueByCourse(courseId: CourseIdEnum): Promise<QueueNumber> {
    const records = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseId, courseId))
      .orderBy(asc(queueNumbers.queueNumber))
      .limit(1)

    const record: SelectQueueNumber = records[0]

    return record
  },

  async enqueue(studentId: number, courseId: CourseIdEnum): Promise<QueueNumber> {
    const count = await db.$count(queueNumbers, eq(queueNumbers.courseId, courseId))

    const data: InsertQueueNumber = {
      studentId: studentId,
      courseId: courseId,
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
