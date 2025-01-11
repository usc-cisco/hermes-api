import { HttpStatusEnum } from "../types/enums/HttpStatusEnum"
import { AuthMiddlewareContext, QueueJwtPayload } from "../types/interfaces/JwtInterface"

export const validateQueueToken = async (context: AuthMiddlewareContext): Promise<void | { message: string }> => {
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
