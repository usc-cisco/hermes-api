import { QueueNumber } from "../entities/queue-number"
import { CourseIdEnum } from "../enums/CourseIdEnum"

export type IQueueNumberService = {
  findByCourse(course_id: CourseIdEnum): Promise<Partial<QueueNumber[]>>
  findCurrentQueueByCourse(course_id: CourseIdEnum): Promise<QueueNumber>
  enqueue(student_id: number, course_id: CourseIdEnum): Promise<QueueNumber>
  dequeue(id: number): Promise<void>
  reset(): Promise<void>
}
