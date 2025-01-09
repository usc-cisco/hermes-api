import { db } from ".."
import { ICoursesService } from "../../types/abstracts/courses-service.abstract"
import { Course } from "../../types/entities/course"
import { CourseIdEnum } from "../../types/enums/CourseIdEnum"
import { courses } from "../models/courses.model"
import { eq } from "drizzle-orm"

export const coursesService: ICoursesService = {
  async findCoordinatorAvailability(course_id: CourseIdEnum): Promise<Partial<Course>> {
    const records = await db
      .select({ coordinatorAvailability: courses.coordinatorAvailability })
      .from(courses)
      .where(eq(courses.id, course_id))

    const record = records[0]

    return record
  },

  async updateCoordinatorAvailability(course_id: CourseIdEnum, availability: boolean): Promise<Course> {
    const records = await db
      .update(courses)
      .set({ coordinatorAvailability: availability })
      .where(eq(courses.id, course_id))
      .returning()

    const record = records[0]

    return record
  },
}
