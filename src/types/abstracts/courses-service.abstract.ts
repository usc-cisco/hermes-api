import { Course } from "../entities/course"
import { CourseIdEnum } from "../enums/CourseIdEnum"

export type ICoursesService = {
  findCoordinatorAvailability(course_id: CourseIdEnum): Promise<Partial<Course>>
  updateCoordinatorAvailability(course_id: CourseIdEnum, availability: boolean): Promise<Course>
}
