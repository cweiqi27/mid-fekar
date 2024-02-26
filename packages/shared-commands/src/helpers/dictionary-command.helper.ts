import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'
import * as O from 'fp-ts/lib/Option.js'
import * as RA from 'fp-ts/lib/ReadonlyArray.js'
import * as TE from 'fp-ts/lib/TaskEither.js'

import type { JSONParseError } from '@/common/error.js'
import type { ChatInputCommandInteraction } from '@/providers/discord.js'
import type { SlashCommandStruct } from './commands.helper.js'
import { genericErrorInteractionReply } from '@/common/error.js'
import { logger } from '@/common/logger.js'
import { APPLICATION_COMMAND_TYPE } from '@/providers/discord.js'
import { decodeDictionaryApi } from '@/schemas/dictionary.schema.js'

export const dictionaryCommand = {
  data: {
    name: 'dictionary',
    type: APPLICATION_COMMAND_TYPE.ChatInput,
    description: 'Search word definition',
  },
  execute: (interaction: ChatInputCommandInteraction) => {
    const rawRes = TE.tryCatch(
      () => fetch('https://api.dictionaryapi.dev/api/v2/entries/en/hello'),
      (e) => ({ type: 'FetchError', error: E.toError(e) }),
    )

    const validatedRes = pipe(
      rawRes,
      TE.flatMap((res) =>
        TE.tryCatch<JSONParseError, unknown>(
          () => res.json(),
          (e) => ({ type: 'JSONError', error: E.toError(e) }),
        ),
      ),
      TE.map((res) => pipe(res, decodeDictionaryApi)),
    )

    const mappedRes = pipe(
      validatedRes,
      TE.map((resEither) =>
        pipe(
          resEither,
          E.map(
            flow(
              pipe(
                RA.map(
                  (b) =>
                    `word: ${b.word} title: ${pipe(
                      b,
                      O.fromPredicate((c) => c.phonetics !== undefined),
                      O.match(
                        () => b.phonetic,
                        (uhh) =>
                          pipe(
                            uhh.phonetics!,
                            RA.map((bobo) => bobo.text),
                          ).join(),
                      ),
                    )}`,
                ),
              ),
            ),
          ),
        ),
      ),
    )

    return pipe(
      mappedRes,
      TE.match(
        (e) => {
          pipe(`[${e.type}] ${e.error.message}.`, logger.error)
          return interaction.reply(genericErrorInteractionReply)
        },
        (fetchedValue) =>
          pipe(
            fetchedValue,
            E.match(
              (e) => {
                pipe(`[${e.type}] ${e.error.message}.`, logger.error)
                return interaction.reply(genericErrorInteractionReply)
              },
              (dat) => interaction.reply(dat.join()),
            ),
          ),
      ),
    )
  },
} as const satisfies SlashCommandStruct
