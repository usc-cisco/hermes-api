import { QueueNumber } from "../entities/queue-number"
import { CourseIdEnum } from "../enums/CourseIdEnum"

export type IQueueNumberService = {
  findByCourse(courseId: CourseIdEnum): Promise<Partial<QueueNumber[]>>
  findCurrentQueueByCourse(courseId: CourseIdEnum): Promise<QueueNumber>
  enqueue(studentId: number, courseId: CourseIdEnum): Promise<QueueNumber>
  dequeue(id: number): Promise<void>
  reset(): Promise<void>
}
