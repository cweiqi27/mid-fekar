import type { LazyArg } from 'fp-ts/lib/function.js'
import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'
import * as TO from 'fp-ts/lib/TaskOption.js'
import * as d from 'io-ts/lib/Decoder.js'

import { logger } from './logger.js'

export const printDecoderRes = E.match(flow(d.draw, logger.error), logger.info)

export const toPromiseThunk =
  <T>(promise: Promise<T>): LazyArg<Promise<T>> =>
  () =>
    promise

export const fromThunk = <T>(thunk: LazyArg<Promise<T>>): TO.TaskOption<T> => {
  return pipe(thunk, TO.tryCatch)
}

export const logAndReturn =
  (logMessage?: string) =>
  <T>(arg: T) => {
    logMessage && logger.info(logMessage)
    logger.info(arg)
    return arg
  }
