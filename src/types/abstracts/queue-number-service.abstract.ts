import { QueueNumber } from "../entities/QueueNumber"
import { CourseNameEnum } from "../enums/CourseNameEnum"

export type IQueueNumberService = {
  findByCourse(courseName: CourseNameEnum): Promise<Partial<QueueNumber[]>>
  findCurrentQueueByCourse(courseName: CourseNameEnum): Promise<QueueNumber>
  enqueue(courseName: CourseNameEnum): Promise<QueueNumber>
  dequeue(id: number): Promise<void>
  resetAll(): Promise<void>
  resetByCourse(courseName: CourseNameEnum): Promise<void>
}
