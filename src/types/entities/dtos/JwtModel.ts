import { CourseUnion } from "./CourseUnion"
import { t } from "elysia"

export const JWTModel = t.Object({
  idNumber: t.Number(),
  course: CourseUnion,
})
