import { QueueNumber } from "../entities/QueueNumberEntity"
import { CourseIdEnum } from "../enums/CourseIdEnum"

export type IQueueNumberService = {
  findByCourse(courseId: CourseIdEnum): Promise<Partial<QueueNumber[]>>
  findCurrentQueueByCourse(courseId: CourseIdEnum): Promise<QueueNumber>
  enqueue(courseId: CourseIdEnum): Promise<QueueNumber>
  dequeue(id: number): Promise<void>
  reset(): Promise<void>
}
