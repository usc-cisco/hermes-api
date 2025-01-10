import { db } from ".."
import { IStudentService } from "../../types/abstracts/student-service.abstract"
import { Student } from "../../types/entities/Student"
import { SelectStudent, students } from "../models/students.model"
import { eq } from "drizzle-orm"

export const studentService: IStudentService = {
  async findStudentById(studentId: string): Promise<Student> {
    const records = await db.select().from(students).where(eq(students.id, studentId))

    const record: SelectStudent = records[0]

    return record
  },
}
