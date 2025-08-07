import { Student } from "../../types/entities/Student"

export type IStudentService = {
  addStudent(student: Student): Promise<Student>
  findStudentById(studentId: string): Promise<Student>
}
