import { JWTInterface, QueueJwtPayload } from "../types/interfaces/JwtInterface"

export const GetAuthQueueToken = async (queueJwt: JWTInterface["queueJwt"], body: QueueJwtPayload) => {
  const token = await queueJwt.sign(body)

  return token
}
