import * as E from 'fp-ts/lib/Either.js'
import { pipe } from 'fp-ts/lib/function.js'
import * as d from 'io-ts/lib/Decoder.js'

import { logger } from './logger.js'

const ENV_DATA = {
  DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  DIECORD_GENERAL_CHANNEL_ID: process.env.DIECORD_GENERAL_CHANNEL_ID,
} as const

const envSchema = d.struct({
  DISCORD_BOT_TOKEN: d.string,
  CLIENT_ID: d.string,
  GUILD_ID: d.string,
  DIECORD_GENERAL_CHANNEL_ID: d.string,
} satisfies Record<keyof typeof ENV_DATA, unknown>)

const decodedData = envSchema.decode(ENV_DATA)

export const env = pipe(
  decodedData,
  E.match(
    (e) => {
      pipe(e, d.draw, (msg) => logger.error(`[Env Error] ${msg}`))
      process.exit(1)
    },
    (dat) => dat,
  ),
)
