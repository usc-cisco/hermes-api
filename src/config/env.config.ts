export const env = {
  PORT: process.env.PORT || 3000,
  LOGFILE_NAME: process.env.LOGFILE_NAME || "./server.log",
  JWT_SECRET: process.env.JWT_SECRET || "TEST SECRET KEY",
  JWT_EXPIRY: Number(process.env.QUEUE_EXPIRY) - new Date().getHours(),
}
