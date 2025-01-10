import { db } from ".."
import { IQueueNumberService } from "../../types/abstracts/queue-number-service.abstract"
import type { QueueNumber } from "../../types/entities/QueueNumber"
import type { CourseNameEnum } from "../../types/enums/CourseNameEnum"
import { InsertQueueNumber, SelectQueueNumber, queueNumbers } from "../models/queue-number.model"
import { asc, desc, eq } from "drizzle-orm"

export const queueNumberService: IQueueNumberService = {
  async findByCourse(courseName: CourseNameEnum): Promise<QueueNumber[]> {
    const records = await db.select().from(queueNumbers).where(eq(queueNumbers.courseName, courseName))

    return records
  },

  async findCurrentQueueByCourse(courseName: CourseNameEnum): Promise<{ current: number; max: number }> {
    const currentQueueRecord = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseName, courseName))
      .orderBy(asc(queueNumbers.queueNumber))
      .limit(1)

    const current: number = currentQueueRecord.length ? currentQueueRecord[0].queueNumber : 0

    const maxQueueRecord = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseName, courseName))
      .orderBy(desc(queueNumbers.queueNumber))
      .limit(1)

    const max: number = maxQueueRecord.length ? maxQueueRecord[0].queueNumber : 0

    return { current, max }
  },
  async enqueue(courseName: CourseNameEnum): Promise<QueueNumber> {
    const count = await db.$count(queueNumbers, eq(queueNumbers.courseName, courseName))

    const data: InsertQueueNumber = {
      courseName: courseName,
      queueNumber: count + 1,
    }

    const records = await db.insert(queueNumbers).values(data).returning()
    const record = records[0]

    return record
  },

  async dequeue(courseName: CourseNameEnum): Promise<void> {
    const currentQueueRecord = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseName, courseName))
      .orderBy(asc(queueNumbers.queueNumber))
      .limit(1)

    const current: SelectQueueNumber = currentQueueRecord[0]

    await db.delete(queueNumbers).where(eq(queueNumbers.id, current.id))
  },

  async resetAll(): Promise<void> {
    await db.delete(queueNumbers)
  },

  async resetByCourse(courseName: CourseNameEnum): Promise<void> {
    await db.delete(queueNumbers).where(eq(queueNumbers.courseName, courseName))
  },
}
