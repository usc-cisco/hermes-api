import { CourseUnion } from "./CourseUnion"
import { t } from "elysia"

export const JwtModel = t.Object({
  idNumber: t.String(),
  course: CourseUnion,
})
