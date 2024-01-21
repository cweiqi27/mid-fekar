import { logger } from './logger.js'

export const logAndReturn =
  (logMessage?: string) =>
  <T>(arg: T) => {
    logMessage && logger.info(logMessage)
    logger.info(arg)
    return arg
  }
