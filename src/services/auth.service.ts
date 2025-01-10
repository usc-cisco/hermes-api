import { CourseNameEnum } from "../types/enums/CourseNameEnum"
import { JWTInterface } from "../types/interfaces/JwtInterface"

// ** Mock Queue Number ** //
const CourseQueue: { [key: string]: number } = {
  it: 0,
  cs: 0,
  is: 0,
}

export const GetAuthQueueToken = async (queueJwt: JWTInterface["queueJwt"], course: CourseNameEnum) => {
  const queueNumber = CourseQueue[course]++

  const Queue = {
    course: course,
    queueNumber: queueNumber,
  }

  const token = await queueJwt.sign(Queue)

  return `Bearer ${token}`
}
