import { getJwtExpiry } from "../utils/time.util"

export const env = {
  PORT: process.env.PORT || 3000,
  LOGFILE_NAME: process.env.LOGFILE_NAME || "./server.log",
  JWT_SECRET: process.env.JWT_SECRET || "TEST SECRET KEY",
  JWT_EXPIRY: getJwtExpiry(process.env.QUEUE_START || "07:30", process.env.QUEUE_EXPIRY || "17:00"),
}