import { HttpStatusEnum } from "../types/enums/HttpStatusEnum"
import { JWTMiddlewareContext, QueueJwtPayload } from "../types/interfaces/JwtInterface"

export const QueueTokenValidation = async (context: JWTMiddlewareContext): Promise<void | { message: string }> => {
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
    return { message: "Queue Number Expired" }
  }

  context.headers.queueNumber = validToken.queueNumber.toString()
  context.headers.course = validToken.course
}

// export const CourseValidation = async (context : JWTMiddlewareContext): Promise<void | { message: string } > => {

// }
