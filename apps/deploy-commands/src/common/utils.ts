import { logger } from './logger.js'

export const genericNormalExit = () => {
  logger.info('Process executed, exiting...')
  process.exit(0)
}
