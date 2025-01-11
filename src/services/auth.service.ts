import { JwtInterface, QueueJwtPayload } from "../types/interfaces/JwtInterface"

export const getAuthToken = async (queueJwt: JwtInterface["queueJwt"], body: QueueJwtPayload) => {
  const token = await queueJwt.sign(body)

  return token
}
