import { QueueNumber } from "../entities/QueueNumber"
import { CourseNameEnum } from "../enums/CourseNameEnum"

export type IQueueNumberService = {
  findByCourse(courseName: CourseNameEnum): Promise<Partial<QueueNumber[]>>
  findByStudentId(studentId: string): Promise<QueueNumber>
  findCurrentQueueByCourse(courseName: CourseNameEnum): Promise<{ current: number; max: number }>
  enqueue(courseName: CourseNameEnum, studentId: string): Promise<QueueNumber>
  dequeue(courseName: CourseNameEnum): Promise<void>
  resetAll(): Promise<void>
  resetByCourse(courseName: CourseNameEnum): Promise<void>
}
