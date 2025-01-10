import { db } from ".."
import { IQueueNumberService } from "../../types/abstracts/queue-number-service.abstract"
import type { QueueNumber } from "../../types/entities/QueueNumber"
import { CourseIdEnum } from "../../types/enums/CourseIdEnum"
import { InsertQueueNumber, queueNumbers } from "../models/queue-number.model"
import { asc, desc, eq } from "drizzle-orm"

export const queueNumberService: IQueueNumberService = {
  async findByCourse(courseId: CourseIdEnum): Promise<QueueNumber[]> {
    const records = await db.select().from(queueNumbers).where(eq(queueNumbers.courseId, courseId))

    return records
  },

  async findCurrentQueueByCourse(courseId: CourseIdEnum): Promise<{ current: number; max: number }> {
    const currentQueueRecord = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseId, courseId))
      .orderBy(asc(queueNumbers.queueNumber))
      .limit(1)

    const current: number = currentQueueRecord[0].queueNumber

    const maxQueueRecord = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseId, courseId))
      .orderBy(desc(queueNumbers.queueNumber))
      .limit(1)

    const max: number = maxQueueRecord[0].queueNumber

    return { current, max }
  },

  async enqueue(courseId: CourseIdEnum): Promise<QueueNumber> {
    const count = await db.$count(queueNumbers, eq(queueNumbers.courseId, courseId))

    const data: InsertQueueNumber = {
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
