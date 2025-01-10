import { Student } from "../../types/entities/Student"

export type IStudentService = {
  findStudentById(studentId: string): Promise<Student>
}
