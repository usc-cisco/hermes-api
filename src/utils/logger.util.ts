import { env } from "../config/env.config"
import { createPinoLogger, fileLogger, logger } from "@bogeychan/elysia-logger"
import pretty from "pino-pretty"

const stream = pretty({
  levelFirst: true,
  colorize: true,
})

const log = createPinoLogger({ stream })

/**
 * Logger class for logging messages with optional context and data.
 * Supports both instance-based and static logging.
 */
export class Logger {
  private context: object | null

  /**
   * Creates an instance of Logger with an optional context object.
   * @param {object | null} context - Context to include in all log messages (default is null).
   *
   * @example
   * const customLogger = new Logger({ serverId: '123', userId: 456 });
   * customLogger.log('Operation started');
   */
  constructor(context: object | null = null) {
    this.context = context
  }

  static fileMiddleware() {
    return fileLogger({
      file: env.LOGFILE_NAME,
    })
  }

  static streamMiddleware() {
    return logger({ stream })
  }

  static log(msg: string, data?: object) {
    log.info(msg, { data })
  }

  static warn(msg: string, data?: object) {
    log.warn(msg, { data })
  }

  static error(msg: string, data?: object) {
    log.error(msg, { data })
  }

  log(msg: string, data?: object) {
    log.info(msg, { context: this.context, data })
  }

  warn(msg: string, data?: object) {
    log.warn(msg, { context: this.context, data })
  }

  error(msg: string, data?: object) {
    log.error(msg, { context: this.context, data })
  }
}
