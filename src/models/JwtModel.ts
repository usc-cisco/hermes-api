import { CourseUnion } from "../types/entities/dtos/CourseUnion"
import { t } from "elysia"

export const JWTModel = t.Object({ idNumber: t.Number(), course: CourseUnion })
