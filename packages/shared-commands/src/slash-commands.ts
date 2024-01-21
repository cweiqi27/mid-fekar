import * as E from 'fp-ts/lib/Either.js'
import { flow, pipe } from 'fp-ts/lib/function.js'
import * as RA from 'fp-ts/lib/ReadonlyArray.js'
import * as TE from 'fp-ts/lib/TaskEither.js'

import type { SlashCommandStruct } from './commands.js'
import type { ChatInputCommandInteraction } from './providers/discord.js'
import { logger } from './common/logger.js'
import { APPLICATION_COMMAND_TYPE } from './providers/discord.js'
import { dictionaryApi } from './schemas/dictionary.schema.js'

export const pingCommand = {
  data: {
    name: 'ping',
    type: APPLICATION_COMMAND_TYPE.ChatInput,
    description: 'Ping bot',
  },
  execute: (interaction: ChatInputCommandInteraction) =>
    interaction.reply('pong'),
} as const satisfies SlashCommandStruct

export const dictionaryCommand = {
  data: {
    name: 'dictionary',
    type: APPLICATION_COMMAND_TYPE.ChatInput,
    description: 'Search word definition',
  },
  execute: async (interaction: ChatInputCommandInteraction) => {
    const rawRes = TE.tryCatch(
      () => fetch('https://api.dictionaryapi.dev/api/v2/entries/en/helloo'),
      (e) => ({ type: 'FetchError', error: E.toError(e) }),
    )

    const stuff = await pipe(
      rawRes,
      TE.flatMap((res) =>
        TE.tryCatch(
          () => res.json(),
          (e) => ({ type: 'JSONError', error: E.toError(e) }),
        ),
      ),
      TE.map((res) => pipe(res, dictionaryApi)),
    )()

    return pipe(
      stuff,
      E.flatMap((a) =>
        pipe(
          a,
          E.map(flow(pipe(RA.map((b) => `word: ${b.word} title: ${b.title}`)))),
        ),
      ),
      E.match(
        (e) => {
          pipe(`[${e.type}] ${e.error.message}`, logger.error)
          return interaction.reply('Oops! Something went wrong!')
        },
        (dat) => interaction.reply(dat.join()),
      ),
    )
  },
} as const satisfies SlashCommandStruct
