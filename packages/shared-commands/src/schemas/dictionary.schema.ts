import * as E from 'fp-ts/lib/Either.js'
import { pipe } from 'fp-ts/lib/function.js'
import * as d from 'io-ts/lib/Decoder.js'

import { logger } from '@/common/logger.js'

type DictionaryApi = {
  title?: string
  word?: string
}

const dictionaryApiSchema = d.array(
  d.partial({
    title: d.string,
    word: d.string,
  } satisfies Record<keyof DictionaryApi, unknown>),
)

const decodedData = (data: unknown) => dictionaryApiSchema.decode(data)

export const dictionaryApi = (data: unknown) =>
  pipe(
    data,
    decodedData,
    E.bimap(
      (e) => {
        pipe(e, d.draw, (msg) => logger.error(`[SchemaError] ${msg}`))
        return { type: 'SchemaError', error: E.toError(e) }
      },
      (dat) => dat,
    ),
  )
