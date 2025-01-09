import { CourseNameEnum } from "../../enums/CourseNameEnum"
import { t } from "elysia"

export const CourseUnion = t.Union([
  t.Literal(CourseNameEnum.BSCS),
  t.Literal(CourseNameEnum.BSIT),
  t.Literal(CourseNameEnum.BSIT),
])
