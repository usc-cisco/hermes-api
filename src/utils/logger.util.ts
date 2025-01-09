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

  static log(msg: string, data?: object) {
    console.info(msg, { data })
  }

  static warn(msg: string, data?: object) {
    console.warn(msg, { data })
  }

  static error(msg: string, data?: object) {
    console.error(msg, { data })
  }

  log(msg: string, data?: object) {
    console.info(msg, { context: this.context, data })
  }

  warn(msg: string, data?: object) {
    console.warn(msg, { context: this.context, data })
  }

  error(msg: string, data?: object) {
    console.error(msg, { context: this.context, data })
  }
}
