import { logger } from './logger.js'

export type CustomError<T extends string> = Readonly<{ type: T; error: Error }>

export type LoginError = CustomError<'LoginError'>
export type RegisterCommandsError = CustomError<'RegisterCommandsError'>

export const genericErrorExit = <T extends string>(e: CustomError<T>) => {
  logger.error(`[${e.type}] ${e.error.message}`)
  process.exit(1)
}
