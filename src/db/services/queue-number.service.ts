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

  async findByStudentId(studentId: string): Promise<QueueNumber> {
    const records = await db.select().from(queueNumbers).where(eq(queueNumbers.studentId, studentId))

    const record: SelectQueueNumber = records[0]

    return record
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
  async enqueue(courseName: CourseNameEnum, studentId: string): Promise<QueueNumber> {
    const maxQueueRecord = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseName, courseName))
      .orderBy(desc(queueNumbers.queueNumber))
      .limit(1)

    const max: number = maxQueueRecord.length ? maxQueueRecord[0].queueNumber : 0

    const data: InsertQueueNumber = {
      studentId,
      courseName,
      queueNumber: max + 1,
    }

    const records = await db.insert(queueNumbers).values(data).returning()
    const record = records[0]

    return record
  },

  async dequeueFront(courseName: CourseNameEnum): Promise<void> {
    const currentQueueRecord = await db
      .select()
      .from(queueNumbers)
      .where(eq(queueNumbers.courseName, courseName))
      .orderBy(asc(queueNumbers.queueNumber))
      .limit(1)

    if (!currentQueueRecord) {
      // Don't do anything if no queue numbers exists
      return
    }

    const current: SelectQueueNumber = currentQueueRecord[0]

    await db.delete(queueNumbers).where(eq(queueNumbers.id, current.id))
  },

  async dequeueById(studentId: string): Promise<void> {
    await db.delete(queueNumbers).where(eq(queueNumbers.studentId, studentId))
  },

  async resetAll(): Promise<void> {
    await db.delete(queueNumbers)
  },

  async resetByCourse(courseName: CourseNameEnum): Promise<void> {
    await db.delete(queueNumbers).where(eq(queueNumbers.courseName, courseName))
  },
}
