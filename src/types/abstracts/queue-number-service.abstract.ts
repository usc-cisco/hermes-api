import { QueueNumber } from "../entities/QueueNumber"
import { CourseNameEnum } from "../enums/CourseNameEnum"

export type IQueueNumberService = {
  findByCourse(courseName: CourseNameEnum): Promise<Partial<QueueNumber[]>>
  findByStudentId(studentId: string): Promise<QueueNumber>
  findCurrentQueueByCourse(courseName: CourseNameEnum): Promise<{
    current: number
    max: number
    queuedStudents: Array<{
      queueNumber: number
      student: { id: string; name: string } | null
    }>
  }>
  enqueue(courseName: CourseNameEnum, studentId: string): Promise<QueueNumber>
  dequeueFront(courseName: CourseNameEnum): Promise<void>
  dequeueById(studentId: string): Promise<void>
  resetAll(): Promise<void>
  resetByCourse(courseName: CourseNameEnum): Promise<void>
}
