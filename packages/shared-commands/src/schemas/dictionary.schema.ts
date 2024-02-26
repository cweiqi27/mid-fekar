import * as E from 'fp-ts/lib/Either.js'
import { pipe } from 'fp-ts/lib/function.js'
import * as d from 'io-ts/lib/Decoder.js'

import type { SchemaError } from '@/common/error.js'
import { logger } from '@/common/logger.js'

export type DictionaryApi = {
  word: string
  phonetic: string
  phonetics: {
    text: string
    audio?: string
    sourceUrl?: string
    license?: { name: string; url: string }
  }[]
  meanings: {
    partOfSpeech: string
    definitions: {
      definition: string
      synonyms: string[]
      antonyms: string[]
    }[]
  }[]
}

const dictionaryApiSchema = d.array(
  d.partial({
    word: d.string,
    phonetic: d.string,
    phonetics: d.array(
      d.partial({
        text: d.string,
        audio: d.string,
        sourceUrl: d.string,
        license: d.partial({ name: d.string, url: d.string }),
      }),
    ),
    meanings: d.array(
      d.partial({
        partOfSpeech: d.string,
        definitions: d.array(
          d.partial({
            definition: d.string,
            synonyms: d.array(d.string),
            antonyms: d.array(d.string),
          }),
        ),
      }),
    ),
  } satisfies Record<keyof DictionaryApi, unknown>),
)

export type DictionaryApiSchema = d.TypeOf<typeof dictionaryApiSchema>
const decodeData = (data: unknown) => dictionaryApiSchema.decode(data)

export const decodeDictionaryApi = (
  data: unknown,
): E.Either<SchemaError, DictionaryApiSchema> =>
  pipe(
    data,
    decodeData,
    E.mapLeft((e) => {
      pipe(e, d.draw, (msg) => logger.error(`[SchemaError] ${msg}`))
      return { type: 'SchemaError', error: E.toError(e) }
    }),
  )
