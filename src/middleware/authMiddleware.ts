import { HttpStatusEnum } from "../types/enums/HttpStatusEnum"
import { AuthMiddlewareContext, QueueJwtPayload } from "../types/interfaces/JwtInterface"

export const QueueTokenValidation = async (context: AuthMiddlewareContext): Promise<void | { message: string }> => {
  const { authorization } = context.headers as { authorization?: string }

  if (!authorization) {
    context.set.status = HttpStatusEnum.UNAUTHORIZED
    return { message: "Unauthorized" }
  }

  const token = authorization.split(" ")[1]

  if (!token) {
    context.set.status = HttpStatusEnum.UNAUTHORIZED
    return { message: "Unauthorized" }
  }

  const validToken = (await context.queueJwt.verify(token)) as QueueJwtPayload | false

  if (!validToken) {
    context.set.status = HttpStatusEnum.UNAUTHORIZED
    return { message: "Queue Number Expired or Invalid Token" }
  }

  context.headers.idNumber = validToken.idNumber.toString()
  context.headers.course = validToken.course
}

// Validate if the user's requested course is equal to his registered queue course
export const CourseValidation = async (context: AuthMiddlewareContext): Promise<void | { message: string }> => {
  const { course: headerCourse } = context.headers as { course?: string }

  if (!headerCourse) {
    context.set.status = HttpStatusEnum.BAD_REQUEST
    return { message: "Course header is required" }
  }

  if (headerCourse !== context.params.course) {
    context.set.status = HttpStatusEnum.UNAUTHORIZED
    return { message: `You are not authorized to access ${context.params.course}` }
  }
}
